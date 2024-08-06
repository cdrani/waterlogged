<script>
    import Cell from './Cell.svelte'
    import { getWeekIndex } from '../utils/date'

    $: translation = (((7 * cellRect) - cellGap) + monthGap) * index

    export let cellGap
    export let cellRadius
    export let cellRect
    export let cellSize
    export let cellClick
    export let days
    export let fontColor
    export let fontFamily
    export let fontSize
    export let index
    export let monthGap
    export let monthLabelHeight
    export let monthLabels
</script>


<g transform={`translate(${translation}, 0)`}>
    {#each days as day}
        <Cell
            date={day.date}
            size={cellSize}
            value={day.value}
            color={day.color}
            click={cellClick}
            radius={cellRadius}
            x={day.date.getDay() * cellRect}
            y={(getWeekIndex(day.date) * cellRect) + monthLabelHeight}
        />
    {/each}

    {#if monthLabelHeight > 0}
        <text
            x="0"
            y="0"
            fill={fontColor}
            font-size={fontSize}
            font-family={fontFamily}
            alignment-baseline="hanging"
        >
            {monthLabels[days[0].date.getMonth()]}
        </text>
    {/if}
</g>

