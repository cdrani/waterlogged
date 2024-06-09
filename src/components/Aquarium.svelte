<script lang="ts">
    import { onMount } from 'svelte'

    import DataStore from '../stores'

    import Button from './Button.svelte';
    import CurrentTime from './CurrentTime.svelte';

    export let port: any
    const store = new DataStore(port)

    onMount(async () => {
        return() => {
            port = null
            store.disconnect()
        }
    })

    $: goal = store.goal
    $: total = store.total
    $: waterLevel = store.waterLevel
    $: measurement = store.measurement
</script>

<section class="relative -z-100 bg-cyan-500 flex flex-col p-4 w-full h-[150px]">
    <div class="flex relative z-10 flex-col mb-4 w-full">
        <CurrentTime />
        <h3 
            class="font-semibold text-lg text-white"
        >
            {$total} / {$goal} {$measurement} drank
        </h3>
    </div>
    <div class="flex relative z-10">
        <div class="flex gap-x-4 w-1/2">
            <Button text="-" handler={() => store.decrementAmount() } />
            <Button text="+" handler={() => store.incrementAmount() } />
        </div>
    </div>

    <div class="flex z-0 absolute left-0 bottom-0 w-full h-[150px] overflow-hidden">
        <div class="wave" style="--wave-height: {Math.max(0, $waterLevel)}%" />
    </div>
</section>
