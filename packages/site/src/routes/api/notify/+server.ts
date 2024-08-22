import { json, type RequestHandler } from '@sveltejs/kit'
import { admin } from '$lib/firebase/admin'

export const POST: RequestHandler = async ({ request }) => {
    const { token, title, notificationOptions } = await request.json()
    const { body, tag, icon, requireInteraction } = notificationOptions

    try {
        const response = await admin.messaging().send({
            token,
            data: {
                title,
                icon,
                body,
                tag,
                link: 'https://localhost:5173/logs',
                requireInteraction: requireInteraction.toString(),
            },
            webpush: {
                notification: {
                    tag: 'Time to Hydrate!'
                },
                fcmOptions: {
                    link: 'https://localhost:5173/logs'
                }
            }
        })

        return json({ response, notificationOptions })
    } catch (error) {
        return json({ status: 500, error })
    }
}
