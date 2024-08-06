<script>
    import { stringifyDate } from '../utils/date'

    export let click
    export let color
    export let date
    export let radius
    export let size
    export let value
    export let x = 0
    export let y
</script>


<rect
    x={x}
    y={y}
    rx={radius}
    width={size}
    height={size}
    fill={color}
    on:click={click}
    on:keypress={click}
    data-value={value}
    data-date={stringifyDate(date)}
/>

