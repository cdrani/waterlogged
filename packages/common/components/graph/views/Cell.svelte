<script lang="ts">
    import { onMount } from 'svelte'

    import { stringifyDate } from '../utils/date'

    export let color: string
    export let date: Date
    export let y: number
    export let radius: number
    export let size: number
    export let value: number
    export let x: number = 0
    export let click: (date: string) => void

    function pluralize(num: number) {
        if (num == 0) return 'No logs'
        return `${num} log${num == 1 ? '' : 's'}`
    }

    function formatDate(dateString: string) {
        const monthsList = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
        const [year, month, day] = dateString.split('-').map(Number)

        const date = new Date(year, Math.max(month - 1, 0), day, 0, 0, 0)
        const fmonth = monthsList[date.getMonth()]
        const fday = date.getDate()
        
        return `${fmonth} ${fday}`
    }

    const strDate = stringifyDate(date)

    function showToolTip(event: any) {
        const tooltip = document.getElementById('tooltip')
        tooltip.firstChild.textContent = `${pluralize(value)} on ${formatDate(strDate)}`
        tooltip.style.display = 'flex'

        const parent = document.getElementById('main')
        const bounds = parent.getBoundingClientRect()

        const isTouch = event?.touches?.length > 0
        const clientX = isTouch ? event?.touches?.[0]?.clientX : event?.clientX
        const clientY = isTouch ? event?.touches?.[0]?.clientY : event?.clientY

        tooltip.style.left = `${clientX - bounds.left - 65}px`
        tooltip.style.top = `${clientY - bounds.top - 36}px`
        tooltip.style.opacity = '1'
        tooltip.style.transition = 'opacity 0.3s'
    }

    function hideToolTip() {
        const tooltip = document.getElementById('tooltip')
        if (!tooltip) return

        tooltip.style.display = 'none'
    }

    onMount(() => {
        return () => hideToolTip()
    })
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
    on:blur|preventDefault={hideToolTip}
    on:mouseout|preventDefault={hideToolTip}
    on:mousemove|preventDefault={showToolTip}
    on:touchstart|preventDefault={showToolTip}
    on:touchcancel|preventDefault={hideToolTip}
    on:click|preventDefault={() => click(strDate)}
    on:keypress|preventDefault={() => click(strDate)}
    on:touchend|preventDefault={() => click(strDate)}
/>
