<script lang="ts">
    import { db } from 'common/data/db'
    import PopUp from './PopUp.svelte'

    const DAY = 24 * 60 * 60_000
    const user = db.cloud.currentUser
    let showLicenseWarning = false

    function getEvalDaysLeft() {
        const rtf1 = new Intl.RelativeTimeFormat('en', { numeric: 'auto' })
        const evalDaysLeft = $user.license.evalDaysLeft
        return rtf1.formatToParts(evalDaysLeft, 'days').map(i => i.value)
    }

    $: if ($user){
        showLicenseWarning = $user.license.validUntil 
            ? $user.license.validUntil < new Date(Date.now() + 7 * DAY)
            : $user.license.evalDaysLeft
            ? $user.license.evalDaysLeft <= 7
            : false
    }
</script>

{#if $user && $user.license && $user.license.evalDaysLeft && showLicenseWarning}
    <PopUp onClose={() => {}}>
        <div>
            <h1 class="text-center">Your eval period will expire in {getEvalDaysLeft()} 
            <h3>Eval Period Expiration</h3>
            <h5>
                <span class="underline font-semibold">TLDR:</span> {' '}
                Upgrade your account to contiue syncing your data.
            </h5>

            <div class="space-y-2 px-4 md:px-0 pb-2">
                <p>
                    Once you run out of eval days, your data will no
                    longer be able to sync with the cloud and will
                    only be available on this device.
                </p>
                <p>
                    If you would like to continue syncing, you can
                    upgrade your account in the settings.
                </p>
                <p>
                    <b>Note:</b> If, after your eval period, you
                    would like to use the app without upgrading,
                    please continue using it on the same device. If
                    you switch devices and login, your data will not
                    be available.
                </p>
                <p>
                    If you want to switch to another device, you can
                    export your data from the settings on your
                    current device, and import on your new device.
                </p>
            </div>
        </div>
    </PopUp>>
{/if}
