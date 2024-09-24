<script lang="ts">
    import { Confetti } from 'svelte-confetti'
    import { getParty, endParty } from 'common/stores/party'

    const party = getParty()

    let timeoutId: ReturnType<typeof setTimeout>

    $: if ($party.celebrate) {
        // End celebration after 7 seconds
        clearTimeout(timeoutId)
        timeoutId = setTimeout(endParty, 7000)
    }
</script>

{#if $party.celebrate}
    <div class="fixed pointer-events-none h-screen w-screen flex justify-center left-0 top-[-50px] z-[1000000]">
        <Confetti x={[-5, 5]} y={[0, 0.1]} infinite duration={5000} amount={2000} fallDistance="300vh" />
    </div>
{/if}
