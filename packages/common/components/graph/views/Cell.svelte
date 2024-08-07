<script lang="ts">
    import { stringifyDate } from '../utils/date'

    export let color: string
    export let date: Date
    export let y: number
    export let radius: number
    export let size: number
    export let value: number
    export let x: number = 0
    export let posX: number
    export let click: (date: string) => void

    function pluralize(num: number) {
        if (num == 0) return 'No logs'
        return `${num} log${num == 1 ? '' : 's'}`
    }

    function formatDate(dateString: string) {
        const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
        const date = new Date(dateString)
        const month = months[date.getMonth()]
        const day = date.getDate()
        
        return `${month} ${day}`
    }

    const strDate = stringifyDate(date)

    function showToolTip() {
        const tooltip = document.getElementById('tooltip')
        tooltip.firstChild.textContent = `${pluralize(value)} on ${formatDate(strDate)}`
        tooltip.style.display = 'flex'
        tooltip.style.left = `${posX}px`
        tooltip.style.top = `${y + 12}px`
        tooltip.style.opacity = '1'
        tooltip.style.transition = 'opacity 0.3s'
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
    data-value={value}
    data-date={strDate}
    on:blur={hideToolTip}
    on:mouseout={hideToolTip}
    on:mousemove={showToolTip}
    on:click={() => click(strDate)}
    on:keypress={() => click(strDate)}
/>
