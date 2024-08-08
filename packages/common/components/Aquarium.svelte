<script lang="ts">
    import { liveQuery } from 'dexie'

    import { openModal } from 'common/stores/modal'
    import Tank from 'common/components/Tank.svelte'
    import { LogsService } from 'common/data/services'

    function showAddModal() {
        openModal('add')
    }

    let tank = liveQuery(async () => await LogsService.getByDate())
    let waterLevel: number = 0

    $: if ($tank) {
        waterLevel = Math.min(($tank.total / $tank.goal) * 100, 100)
    } 
</script>

{#if $tank}
    <div class="flex relative w-full max-w-[248px] h-[120px] md:h-[160px] mx-4 overflow-hidden rounded-md">
        <Tank 
            tank={$tank}
            waterLevel={waterLevel}
            handleModal={showAddModal}
            handleLog={async () => await LogsService.addLogIntake()}
        />
    </div>
{/if}
