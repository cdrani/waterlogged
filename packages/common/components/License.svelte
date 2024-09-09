<script lang="ts">
    import { db } from 'common/data/db'
    import EvalDays from './EvalDays.svelte'

    const user = db.cloud.currentUser

    async function handleUpgrade() {
        const response = await fetch('/api/stripe/payment', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ userId: $user.userId })
        })

        const url = await response.json()
        window.location.assign(url)
    }

    let licenseType: string = 'Free'

    $: if ($user) {
        console.log({ user: $user })
        // licenseType = $user?.license?.type == 'eval' ? 'Free' : 'Premium'
    }
</script>

{#if !$user?.license}
    <div class="flex w-full justify-between items-center p-4 bg-cyan-400 rounded-md">
        <div class="flex-col">
            <p class="font-bold">Tier: {licenseType}</p>
            {#if licenseType == 'Free'}
                <EvalDays evalDays={$user?.license?.evalDaysLeft} />
            {/if} 
        </div>

        {#if licenseType == 'Free'}
            <button 
                on:click|preventDefault={handleUpgrade}
                on:touchend|preventDefault={handleUpgrade}
                class="inline-flex justify-center self-center items-center w-20 h-10 bg-cyan-800 rounded-md"
            >
                <span class="font-bold text-sm text-white w-full">Upgrade</span>
            </button>
        {/if} 

        {#if licenseType == 'Premium'}
            <a 
                target="_blank"
                on:click|preventDefault={handleUpgrade}
                on:touchend|preventDefault={handleUpgrade}
                class="inline-flex justify-center self-center items-center w-full h-12 bg-cyan-800 rounded-md"
            >
                <span class="font-bold text-sm text-white w-full">Manage Subscription</span>
            </a>
        {/if}
    </div>
{/if}
