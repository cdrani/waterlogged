export async function getAppVersion() {
    const VERSION = 'v0.1.0'
    const app = await import('@tauri-apps/api/app')

    if (app) {
        const version = await app.getVersion()
        return `v${version}`
    }

    return VERSION
}
