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
    <section class="absolute z-[1000] flex flex-col w-full h-full gap-y-2 xs:gap-0 md:gap-y-2 p-4 xs:pt-6 lg:p-8">
        <h1 class="text-center text-white font-bold text-xl xs:text-2xl lg:text-3xl">Congratulations!</h1>
        <h2 class="text-center text-3xl md:text-4xl lg:text-5xl font-bold my-1 xs:my-2 md:my-3">Goal Reached!</h2>
        <h3 class="text-center text-white text-xl md:text-2xl font-black">
            {$log.total} / {$log.goal} ({$log.measurement})
        </h3>

        <p class="text-center font-semibold text-lg xs:text-xl lg:text-2xl mt-2 leading-snug">
            Keep your streak going tomorrow!
        </p>

        <div class="flex flex-end h-full w-full">
            <div class="flex justify-end items-end w-full gap-4">
                <button 
                    class="w-20 h-9 bg-white rounded-md"
                    on:click|preventDefault={handleClose}
                    on:touchend|preventDefault={handleClose}
                >
                    <span class="font-semibold text-[14px] md:text-base">Close</span>
                </button>
            </div>
        </div>
    </section>
{/if}
