<script lang="ts">
    import { onMount } from 'svelte'
    import { getTimeStamp, getMediumDate } from '../utils/date'

    export let classList: string = ''
    export let format: 'time' | 'date' = 'time'
    let currentDateTime = new Date()

    onMount(() => {
        const interval = setInterval(() => {
            currentDateTime = new Date()
        }, 1000)

        return () => {
            clearInterval(interval)
        }
    })

    $: showTime = format == 'time' ? getTimeStamp() : getMediumDate(currentDateTime)
</script>

<h1 class="font-bold text-xl {classList}">{showTime}</h1>
