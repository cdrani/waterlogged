<script>
    import Cell from './Cell.svelte'

    $: translation = cellRect * index

    export let cellRadius
    export let cellRect
    export let cellSize
    export let cellClick
    export let days
    export let index
    export let monthLabelHeight
</script>

<g transform={`translate(${translation}, ${monthLabelHeight})`}>
    {#each days as day}
        <Cell
            date={day.date}
            size={cellSize}
            value={day.value}
            click={cellClick}
            color={day.color}
            radius={cellRadius}
            y={day.date.getDay() * cellRect}
        />
    {/each}
</g>

