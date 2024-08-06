<script lang="ts">
    import { stringifyDate } from '../utils/date'

    export let color: string
    export let date: Date
    export let y: number
    export let radius: number
    export let size: number
    export let value: number
    export let x: number = 0
    export let click: () => void

    function showToolTip(event: any) {
        const tooltip = document.getElementById('tooltip')
        tooltip.innerHTML = stringifyDate(date)
        tooltip.style.display = 'block'
        tooltip.style.left = `${event.layerX - 40}px`
        tooltip.style.top = `${y + 12}px`
        tooltip.style.opacity = '1'
        tooltip.style.transition = 'opacity 0.2s'
    }

    function hideToolTip() {
        const tooltip = document.getElementById('tooltip')
        tooltip.style.display = 'none'
    }

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
    on:blur={hideToolTip}
    on:mouseout={hideToolTip}
    on:mousemove={showToolTip}
    data-date={stringifyDate(date)}
/>
