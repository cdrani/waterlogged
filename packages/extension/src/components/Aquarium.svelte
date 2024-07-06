<script lang="ts">
    import { getToday } from '../stores/today'
    import { openModal } from '../stores/modal'
    import type TodayStore from '../stores/today'

    import Tank from 'common/components/Tank.svelte'

    const store = getToday() as TodayStore

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

    store.today.subscribe(value => {
        let { measurement, goal } = value
        tank = { ...tank, measurement, goal }
    })
</script>

<div class="flex mx-auto w-full h-[120px] px-4 overflow-hidden">
    <Tank 
        tank={tank}
        handleModal={showAddModal}
        handleLog={() => store.logAmount(true) }
    />
</div>
