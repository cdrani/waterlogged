<script lang="ts">
    import { onMount } from "svelte";
    import { getHour, getMinute, getMeridiem } from '../utils/time'

    export let classList: string = ''
    export let format: 'time' | 'date' = 'time'
    let currentDateTime = new Date()

    function getShortTime() {
        const locale = navigator.languages as string[]
        return new Intl.DateTimeFormat(locale, {
            timeStyle: 'short',
        }).format(currentDateTime)
    }

    function getShortDate() {
        const locale = navigator.languages as string[]
        return new Intl.DateTimeFormat(locale, {
            dateStyle: 'medium',
        }).format(currentDateTime)
    }

    onMount(() => {
        const interval = setInterval(() => {
            currentDateTime = new Date()
        }, 1000)

        return () => {
            clearInterval(interval)
        }
    })

    $: showTime = format == 'time' ? getShortTime() : getShortDate()
</script>

<h1 class="text-gray-900 font-bold text-xl {classList}">{showTime}</h1>
