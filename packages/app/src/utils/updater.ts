import { check } from '@tauri-apps/plugin-updater'
import { relaunch } from '@tauri-apps/plugin-process'
import { ask, message } from '@tauri-apps/plugin-dialog'

export async function checkForUpdate() {
    try {
        const update = await check()
        if (!update) return

        console.log(`found update ${update.version} from ${update.date} with notes ${update.body}`)
        let downloaded = 0
        let contentLength: number | undefined = 0

        // alternatively we could also call update.download() and update.install() separately
        // TODO: Add some sort of visual progress indicator for each phase
        await update.downloadAndInstall((event) => {
            switch (event.event) {
                case 'Started':
                    contentLength = event.data.contentLength
                    console.log(`started downloading ${event.data.contentLength} bytes`)
                    break
                case 'Progress':
                    downloaded += event.data.chunkLength
                    console.log(`downloaded ${downloaded} from ${contentLength}`)
                    break
                case 'Finished':
                    console.log('download finished')
                    break
            }
        })

        await relaunch()
    } catch (error) {
        console.error(error)
    }
}

export async function manualUpdate() {
    const update = await check()
    if (update === null) {
        return await message('Failed to check for updates.\nPlease try again later.', { 
            title: 'Error',
            kind: 'error',
            okLabel: 'OK'
        })
	}

    if (update?.available) {
        const yes = await ask(`Update to ${update.version} is available!\n\nRelease notes: ${update.body}`, { 
            title: 'Update Available',
            kind: 'info',
            okLabel: 'Update',
            cancelLabel: 'Cancel'
        })

        if (yes) {
            await update.downloadAndInstall()
            await relaunch()
            // Restart the app after the update is installed by calling the Tauri command that handles restart for your app
            // It is good practice to shut down any background processes gracefully before restarting
            // As an alternative, you could ask the user to restart the app manually
            // await invoke("graceful_restart");
        }
    } else {
        await message('Check regularly for the latest and greatest version of the app.', { 
            title: 'No Update Available',
            kind: 'info',
            okLabel: 'OK'
        })
    }
}
