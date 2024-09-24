<script lang="ts">
    import { liveQuery } from 'dexie'
    import { endParty } from 'common/stores/party'
    import { closeModal } from 'common/stores/modal'
    import { LogsService } from 'common/data/services'

    function handleClose() {
        endParty()
        closeModal()
    }

    let log = liveQuery(async () => await LogsService.getByDate())
</script>

{#if $log}
    <section class="absolute z-[1000] flex flex-col w-full h-full p-4 pt-6">
        <h1 class="text-center font-bold text-lg md:text-xl lg:text-3xl">Congratulations!</h1>
        <h2 class="text-center text-2xl font-medium my-4">You hit your daily goal!</h2>
        <h3 class="text-center text-white text-2xl font-black">
            {$log.total} / {$log.goal} ({$log.measurement})
        </h3>

        <p class="text-center font-semibold text-md md:text-lg lg:text-xl mt-2 leading-snug">
            Keep your streak going tomorrow!
            Adjust your targets as necessary.
        </p>

        <button 
            on:click|preventDefault={handleClose}
            on:touchend|preventDefault={handleClose}
            class="absolute bottom-8 right-8 w-20 h-9 bg-white rounded-md"
        >
            <span class="font-bold text-[14px] md:text-[16px]">Close</span>
        </button>
    </section>
{/if}
