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
    <div class="relative flex justify-center min-w-[248px] w-full px-4 xs:px-6 h-[120px] xs:min-h-[160px] mx-auto overflow-hidden bg-cyan-200">
        <Tank 
            tank={$tank}
            waterLevel={waterLevel}
            handleModal={showAddModal}
            handleLog={async () => await LogsService.addLogIntake()}
        />
    </div>
{/if}
