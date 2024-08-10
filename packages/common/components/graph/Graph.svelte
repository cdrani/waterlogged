<script lang="ts">
    import Week from './views/Week.svelte'
    import Month from './views/Month.svelte'
    import { chunkMonths, chunkWeeks, getCalendar } from './utils/heatmap'

    type View = 'monthly' | 'yearly'

    export let allowOverflow = false
    export let cellGap = 2
    export let cellRadius = 0
    export let cellSize = 10
    export let cellClick = null
    export let colors = ['#c6e48b', '#7bc96f', '#239a3b', '#196127']
    export let data = new Map()
    export let dayLabelWidth = 20
    export let dayLabels = ['', 'Mon', '', 'Wed', '', 'Fri', '']
    export let emptyColor = '#ebedf0'
    export let endDate = null
    export let fontColor = '#333'
    export let fontFamily = 'sans-serif'
    export let fontSize = 8
    export let monthGap = 2
    export let monthLabelHeight = 12
    export let monthLabels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
    export let startDate = null
    export let view: View = 'yearly'

    const isNewMonth = (chunks: Array<Array<{ date: Date }>>, index: number) => {
        const chunk = chunks[index]
        const prev = chunks[index - 1]

        if (!prev) return true
        if (!prev.length || !chunk.length) return false

        const currentIndex = chunk[0].date.getMonth()
        const prevIndex = prev[0].date.getMonth()

        return index < chunks.length && index < chunks.length - 1 && (
            currentIndex > prevIndex || currentIndex === 0 && prevIndex === 11
        )
    }

    $: cellRect = cellSize + cellGap

    $: calendar = getCalendar({ colors, data, emptyColor, endDate, startDate, view })

    $: chunks = view === 'monthly'
        ? chunkMonths({ allowOverflow, calendar, endDate, startDate })
        : chunkWeeks({ allowOverflow, calendar, endDate, startDate })

    $: weekRect = (7 * cellRect) - cellGap

    $: height = view === 'monthly'
        ? (6 * cellRect) - cellGap + monthLabelHeight // <- max of 6 rows in monthly view
        : weekRect + monthLabelHeight

    $: width = view === 'monthly'
        ? ((weekRect + monthGap) * chunks.length) - monthGap
        : (cellRect * chunks.length) - cellGap + dayLabelWidth

    $: dayLabelPosition = (index: number) => {
        return (cellRect * index) + (cellRect / 2) + monthLabelHeight
    }
</script>


<svg viewBox={`0 0 ${width} ${height}`} class="mx-auto py-1.5 bg-cyan-800" overflow="auto" style="width:{width /1.25}px;height:{height}px">
    {#if view === 'monthly'}
        {#each chunks as chunk, index}
            <Month
                cellGap={cellGap}
                cellRadius={cellRadius}
                cellRect={cellRect}
                cellSize={cellSize}
                cellClick={cellClick}
                days={chunk}
                fontColor={fontColor}
                fontFamily={fontFamily}
                fontSize={fontSize}
                index={index}
                monthGap={monthGap}
                monthLabelHeight={monthLabelHeight}
                monthLabels={monthLabels}
            />
        {/each}
    {:else}
        <!-- {#if dayLabelWidth > 0} -->
        <!--     {#each dayLabels as label, index} -->
        <!--         <text -->
        <!--             alignment-baseline="middle" -->
        <!--             fill={fontColor} -->
        <!--             font-family={fontFamily} -->
        <!--             font-size={fontSize} -->
        <!--             x="0" -->
        <!--             y={dayLabelPosition(index)}> -->
        <!--             {label} -->
        <!--         </text> -->
        <!--     {/each} -->
        <!-- {/if} -->
        <g transform={`translate(${dayLabelWidth})`}>
            {#each chunks as chunk, index}
                <Week
                    cellRadius={cellRadius}
                    cellRect={cellRect}
                    cellSize={cellSize}
                    cellClick={cellClick}
                    days={chunk}
                    index={index}
                    monthLabelHeight={monthLabelHeight}
                />
                <!-- {#if monthLabelHeight > 0 && isNewMonth(chunks, index)} -->
                <!--     <text -->
                <!--         alignment-baseline="hanging" -->
                <!--         fill={fontColor} -->
                <!--         font-family={fontFamily} -->
                <!--         font-size={fontSize} -->
                <!--         x={cellRect * index}> -->
                <!--         {monthLabels[chunk[0].date.getMonth()]} -->
                <!--     </text> -->
                <!-- {/if} -->
            {/each}
        </g>
    {/if}
</svg>
