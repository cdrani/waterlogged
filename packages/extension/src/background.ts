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

    await notificationManager.startTimer()
    keepAlive()
})

chrome.runtime.onStartup.addListener(keepAlive)
chrome.tabs.onActivated.addListener(keepAlive)
chrome.tabs.onUpdated.addListener(keepAlive)

chrome.runtime.onMessage.addListener((_message, _sender, sendResponse) => {
    sendResponse({ status: true })
    return true
})

chrome.runtime.onConnect.addListener(async (port) => {
    if (port.name !== 'popup') return

    initMessageHandler({ port, notificationManager })
})
