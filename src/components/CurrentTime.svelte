<script lang="ts">
    import { onMount } from "svelte";
    import { getHour, getMinute, getMeridiem } from '../utils/time'

    let currentDateTime = new Date()

    onMount(() => {
        const interval = setInterval(() => {
            currentDateTime = new Date()
        }, 1000)

        return () => {
            clearInterval(interval)
        }
    })

    $: showTime = `${getHour(currentDateTime)}:${getMinute(currentDateTime)} ${getMeridiem(currentDateTime)}`
</script>

<h1 class="text-gray-900 font-bold text-2xl">{showTime}</h1>
