<script lang="ts">
    import { Confetti } from 'svelte-confetti'
    import { getParty, endParty } from 'common/stores/party'
    import { closeModal } from 'common/stores/modal'

    const party = getParty()

    let timeoutId: ReturnType<typeof setTimeout>

    $: if ($party.celebrate) {
        // End celebration after 10 seconds
        clearTimeout(timeoutId)
        timeoutId = setTimeout(() => {
            endParty(); closeModal()
        }, 10_000)
    }
</script>

{#if $party.celebrate}
    <div class="fixed pointer-events-none h-screen w-full flex justify-center  z-[1000000]">
        <Confetti x={[-5, 5]} y={[-5, 0.1]} infinite duration={5000} amount={2000} fallDistance="300vh" />
    </div>
{/if}
