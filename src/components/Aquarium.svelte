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

<section class="relative -z-100 bg-cyan-500 flex flex-col p-4 w-full h-[120px]">
    <div class="flex relative z-10 mb-4 w-full justify-between">
        <CurrentTime />
        <div>
            <p class="font-semibold text-[14px] text-black">
                Total: {$total}{$measurement}
            </p>
            <p class="font-semibold text-[14px] text-black">
                Goal: {$goal}{$measurement}
            </p>
        </div>
    </div>
    <div class="flex relative z-10">
        <div class="flex gap-x-4 w-1/2">
            <Button text="-" handler={() => store.decrementAmount() } />
            <Button text="+" handler={() => store.incrementAmount() } />
        </div>
    </div>

    <div class="flex z-0 absolute left-0 bottom-0 w-full h-[120px] overflow-hidden">
        <div class="wave" style="--wave-height: {Math.max(0, $waterLevel)}%" />
    </div>
</section>
