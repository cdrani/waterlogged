<script lang="ts">
    import { getLog } from '../stores/log'
    import type LogStore from 'common/stores/log'
    import { openModal } from 'common/stores/modal'

    import Tank from 'common/components/Tank.svelte'

    const store = getLog() as LogStore

    function showAddModal() {
        openModal('add')
    }

    let tank  = {
        total: 0,
        waterLevel: 50,
        measurement: 'ml',
        goal: 0
    }

    // Subscribe to the derived stores
    store.total.subscribe(value => {
        tank = { ...tank, total: value }
    })

    store.waterLevel.subscribe(value => {
        tank = { ...tank, waterLevel: value }
    })

    store.data.subscribe(value => {
        let { measurement, goal } = value ?? tank
        tank = { ...tank, measurement, goal }
    })
</script>

<div class="flex w-full max-w-[248px] h-[120px] mx-4 overflow-hidden rounded-md">
    <Tank 
        tank={tank}
        handleModal={showAddModal}
        handleLog={() => store.logAmount(true) }
    />
</div>
