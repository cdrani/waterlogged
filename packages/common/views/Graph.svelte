<script lang="ts">
    import Graph from 'common/components/graph/Graph.svelte'

    const start = new Date()
    start.setMonth(0, 1)
    start.setHours(0, 0, 0, 0)

    const end = new Date()
    end.setMonth(11, 31)

    const data = new Map()
    data.set("2024-01-25", 1)
    data.set("2024-01-24", 8)
    data.set("2024-01-23", 3)
    data.set("2024-01-22", 5)
    data.set("2024-07-01", 10)
    data.set("2024-05-11", 4)
</script>

<section class="flex relative flex-col mx-auto w-full h-[340px] max-h-[358] bg-cyan-200 p-4">
    <div class="rounded-md overflow-x-scroll pb-4 bg-cyan-700 p-4">
        <Graph 
            data={data}
            view={'yearly'}
            fontSize={12}
            fontColor="white"
            cellGap={4}
            endDate={end}
            startDate={start}
            cellSize={12}
            cellRadius={6}
            dayLabelWidth={32}
            monthLabelHeight={24}
            dayLabels={['', 'Mon', '', 'Wed', '', 'Fri', '']}
            colors={['#404040', '#303030', '#202020', '#101010']}
        />
    </div>
</section>
