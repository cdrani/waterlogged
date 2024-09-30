import { db } from 'common/data/db'
import { setBadgeInfo } from 'common/utils/badge'
import { initMessageHandler } from 'common/messaging'
import { SettingsService } from 'common/data/services'
import { notificationManager } from './utils/notification'

chrome.runtime.onInstalled.addListener(async details => {
    const isOpen = db.isOpen()

    if (!isOpen) await db.open()

    if (details.reason == 'install') {
        setBadgeInfo(true)
        await notificationManager.welcome()
    } else {
        const settings = await SettingsService.load()
        setBadgeInfo(settings?.enabled ?? true)
    }
})

chrome.alarms.onAlarm.addListener(async alarm => {
    await notificationManager.handleAlarm(alarm)
})

chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
    if (message.type == 'playSound') {
        chrome.tabs.query({ active: true, currentWindow: true }, tabs => {
            if (!tabs[0]?.id) return

            chrome.tabs.sendMessage(tabs[0].id, { type: 'playSound', sound: message.sound })
        })
    }
    sendResponse({ status: true })
    return true
})

chrome.runtime.onConnect.addListener(async (port) => {
    if (port.name !== 'popup') return

    initMessageHandler({ port, notificationManager })
})
