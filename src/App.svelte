<script lang="ts">
    import { get, derived } from "svelte/store";
    import { onMount } from "svelte";
    import Button from "./components/Button.svelte"
    import CurrentTime from "./components/CurrentTime.svelte";

    import DataStore from './stores'

    let PORT = chrome.runtime.connect({ name: 'popup' })
    const store = new DataStore(PORT)

    onMount(async () => {
        return() => {
            PORT = null
            store.disconnect()
        }
    })

    $: goal = store.goal
    $: total = store.total
    $: waterLevel = store.waterLevel
    $: measurement = store.measurement
</script>

<main class="relative flex flex-col bg-transparent p-4 w-full h-[150px]">
    <div class="flex flex-col mb-4">
        <CurrentTime />
        <h3 
            class="font-semibold text-lg"
            class:text-slate-600={$waterLevel < 65}
            class:text-slate-200={$waterLevel >= 65}
        >
            {$total} / {$goal} {$measurement} drank
        </h3>
    </div>
    <div class="flex">
        <div class="flex gap-x-4 w-1/2">
            <Button text="-" handler={() => store.decrementAmount() } />
            <Button text="+" handler={() => store.incrementAmount() } />
        </div>
    </div>

    <div 
        style="--height: {Math.max(3, $waterLevel)}%"
        class="flex -z-10 absolute left-0 bottom-0 bg-[#68B6FF] w-full wave"
    />
</main>
