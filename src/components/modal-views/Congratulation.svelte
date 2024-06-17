<script lang="ts">
    import { getToday } from '../../stores/today'
    import { closeModal } from '../../stores/modal'

    const store = getToday()

    $: today = store.today
    $: total = store.total

    function handleClose() {
        store.partied = true 
        closeModal()
    }
</script>

<section class="absolute flex flex-col h-full p-4 pt-6">
    <h1 class="text-center text-white text-xl font-bold">Congratulations!</h1>
    <h2 class="text-center text-white text-lg font-medium">You hit your daily goal!</h2>
    <h3 class="text-center text-white text-2xl font-black mt-2">
        {$total} / {$today.goal} ({$today.measurement})
    </h3>

    <h4 class="text-center text-white text-[13px] mt-3 leading-snug">
        Keep your streak going tomorrow!
        Adjust your targets as necessary.
    </h4>

    <button 
        on:click={handleClose}
        class="absolute bottom-4 right-4 w-16 h-7 bg-white rounded-md"
    >
        <span class="text-[16px] text-black">Close</span>
    </button>
</section>
