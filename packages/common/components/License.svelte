<script lang="ts">
    import { db } from 'common/data/db'
    import EvalDays from './EvalDays.svelte'

    const user = db.cloud.currentUser
    let licenseType: string = 'Free'

    $: if ($user) {
        licenseType = !$user?.license ? 'Free' : $user?.license?.type == 'eval' ? 'Free' : 'Pro'
    }

    const isCRX = () => typeof chrome !== 'undefined' && chrome.runtime

    async function handleUpgrade() {
        try {
            const response = await fetch(import.meta.env.VITE_API_PATH, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json'},
                body: JSON.stringify({ userId: $user.userId, ref: isCRX() ? 'crx' : 'web' })
            })

            const url = await response.json()
            if (!url) return

            if (typeof chrome !== 'undefined' && chrome.runtime) {
                chrome.tabs.create({ url })
            } else {
                window.location.assign(url)
            }
        } catch (error) {
            console.error('Error in handleUpgrade: ', error)
        }
    }
</script>

{#if $user?.license}
    <div class="flex w-full justify-between items-center p-4 bg-cyan-400 rounded-md">
        <div class="flex-col">
            <p class="font-bold text-base min-w-20">Tier: {licenseType}</p>
            {#if licenseType == 'Free'}
                <EvalDays evalDays={$user?.license?.evalDaysLeft} />
            {/if} 
        </div>

        {#if licenseType == 'Free'}
            <button 
                type="button"
                on:click|preventDefault={handleUpgrade}
                on:touchend|preventDefault={handleUpgrade}
                class="inline-flex cursor-pointer justify-center self-center items-center w-20 xs:w-24 h-10 bg-white rounded-md"
            >
                <span class="font-bold text-base w-full">Upgrade</span>
            </button>
        {/if} 

        {#if licenseType == 'Pro'}
            <a 
                target="_blank"
                href={import.meta.env.VITE_STRIPE_CUSTOMER_PORTAL}
                class="inline-flex cursor-pointer justify-center self-center items-center w-36 h-10 bg-white rounded-md"
            >
                <span class="font-bold text-center text-base text-black w-full">Manage Tier</span>
            </a>
        {/if}
    </div>

    <hr class="w-full h-1 bg-cyan-600 my-4" />
{/if}
