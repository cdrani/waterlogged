<script>
    import { onMount, afterUpdate } from 'svelte'
    import Square from './Square.svelte'

    export let contributions = []
    const colors = ['#ebedf0', '#c6e48b', '#7bc96f', '#239a3b', '#196127', '#d0f0c0', '#9be58c', '#52c41a', '#3da940', '#2a7f29', '#a9d6ac', '#4bb543', '#1f7c1c']

    function getColor(count) {
        return colors[Math.min(count, colors.length - 1)]
    }

    const currentDate = new Date()
    const currentYear = currentDate.getFullYear()
    const firstDayOfYear = new Date(currentYear, 0, 1)
    const lastDayOfYear = new Date(currentYear, 11, 31)

    let firstMondayOfYear = new Date(firstDayOfYear)
    firstMondayOfYear.setDate(firstMondayOfYear.getDate() + (8 - firstMondayOfYear.getDay()) % 7)

    let graphData = []

    function updateGraphData() {
        graphData = []
        for (let date = new Date(firstMondayOfYear); date <= lastDayOfYear; date.setDate(date.getDate() + 1)) {
            const year = date.getFullYear()
            const month = date.getMonth() + 1
            const day = date.getDate()
            const dateString = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`
            const contribution = contributions.find((item) => item.date === dateString)
            graphData.push(contribution || { date: dateString, count: 0 })
        }
    }

    onMount(() => {
        updateGraphData()
    })

    afterUpdate(() => {
        updateGraphData()
    })
</script>

<div class="graph">
    <ul class="months">
        <li>Jan</li>
        <li>Feb</li>
        <li>Mar</li>
        <li>Apr</li>
        <li>May</li>
        <li>Jun</li>
        <li>Jul</li>
        <li>Aug</li>
        <li>Sep</li>
        <li>Oct</li>
        <li>Nov</li>
        <li>Dec</li>
    </ul>

    <ul class="days">
        <li>Sun</li>
        <li>Mon</li>
        <li>Tue</li>
        <li>Wed</li>
        <li>Thu</li>
        <li>Fri</li>
        <li>Sat</li>
    </ul>

    <ul class="squares">
        {#each graphData as {date, count}}
          <Square {date} count} color={getColor(count)} />
      {/each}
    </ul>
</div>
