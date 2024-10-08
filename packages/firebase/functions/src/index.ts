import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'
import timezone from 'dayjs/plugin/timezone'
import IsBetween from 'dayjs/plugin/isBetween'

import admin from 'firebase-admin'
import {onSchedule} from 'firebase-functions/v2/scheduler'

admin.initializeApp()

const db = admin.firestore()

dayjs.extend(utc)
dayjs.extend(timezone)
dayjs.extend(IsBetween)

type Subscriber = { token: string, docId: string }
type SubscriberList = Subscriber[]

exports.sendScheduledNotifictions = onSchedule({
    schedule: 'every 1 minute',
    memory: '2GiB',
}, async () => {
    const subscribers = await db.collection('schedules')
        .where('enabled', '==', true)
        .where('alert_type', 'in', ['both', 'notify'])
        .get()

    const usersToNotify: SubscriberList = []
    const now = new Date()

    subscribers.forEach((subscriber) => {
        const {start_time, end_time, time_zone, interval, last_sent_at, fcm_token} = subscriber.data()

        const [startHour, startMinute] = start_time.split(':').map((n: string) => parseInt(n, 10))
        const [endHour, endMinute] = end_time.split(':').map((n: string) => parseInt(n, 10))

        const userLocaleTime = dayjs(now).tz(time_zone)
        const userStartTime = userLocaleTime.hour(startHour).minute(startMinute).second(0)
        const userEndTime = userLocaleTime.hour(endHour).minute(endMinute).second(0)

        // Check if current time is within the user's notification window
        if (userLocaleTime.isBetween(userStartTime, userEndTime)) {
            const minutesSinceLastNotification = userLocaleTime.diff(dayjs(last_sent_at.toDate()).tz(time_zone), 'm')
            if (minutesSinceLastNotification >= interval) usersToNotify.push({token: fcm_token, docId: subscriber.id})
        }
    })

    if (!usersToNotify.length) return

    const successSubscribersList = await sendMessages(usersToNotify)
    if (successSubscribersList?.length) await updateSubscribersTimeStamps(successSubscribersList)
})

const MESSAGE_ERROR_CODES = [
    'messaging/invalid-argument',
    'messaging/invalid-registration-token',
    'messaging/registration-token-not-registered',
]
const MESSAGE_ERROR_MESSAGE = 'The registration token is not a valid FCM registration token'

const sendMessages = async (subscriberList: SubscriberList) => {
    const messages = subscriberList.map(({token}) => ({
        token,
        // TODO: Sending data, but currently not using it in service worker
        // Service worker generates it's own notification options
        data: {
            icon: 'favicon.png',
            tag: 'hydration-time',
            title: 'Time to Hydrate!',
            body: 'Remember to keep hydrated. Take a water break.',
            link: 'https://waterlogged.cdrani.dev/logs',
        },
    }))

    const batchResponse = await admin.messaging().sendEach(messages)

    if (batchResponse.failureCount < 1) return subscriberList

    const successSubscribersList = subscriberList.slice()

    // Clean up subscriptions no longer needed
    for (let i = 0; i < batchResponse.responses.length; i++) {
        const response = batchResponse.responses[i]
        if (response.success) continue

        const errorCode = response?.error?.code
        const errorMessage = response?.error?.message

        if (!errorCode) continue

        if (MESSAGE_ERROR_CODES.includes(errorCode) && errorMessage == MESSAGE_ERROR_MESSAGE) {
            const subscriber = await db.collection('schedules')
                .where('fcm_token', '==', messages[i].token).limit(1).get()

            if (!subscriber.empty) {
                successSubscribersList.splice(i, 1)
                await subscriber.docs[0].ref.delete()
            }
        }
    }

    return successSubscribersList
}

const updateSubscribersTimeStamps = async (usersToNotify: SubscriberList) => {
    usersToNotify.forEach(async ({docId}) => {
        const docRef = db.collection('schedules').doc(docId)
        const timestamp = admin.firestore.FieldValue.serverTimestamp()
        await docRef.update({last_sent_at: timestamp})
    })
}
