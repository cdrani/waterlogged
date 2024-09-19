export const VERSION = 'v0.1.0'

export async function getAppVersion() {
    const isTauri = 'isTauri' in window && !!window.isTauri

    if (isTauri) {
        const app = await import('@tauri-apps/api/app')
        const version = await app.getVersion()
        return `v${version}`
    }

    return VERSION
}
