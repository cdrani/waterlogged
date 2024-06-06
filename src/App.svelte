<script lang="ts">
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

    $: total = store.total
    $: measurement = store.measurement
</script>

<main class="flex flex-col bg-white w-full h-full">
    <div class="flex flex-col p-4">
        <CurrentTime />
        <h3 class="text-gray-500 font-semibold text-lg">{$total}{$measurement} drank</h3>
    </div>
    <div class="flex h-full bg-[#68B6FF]">
        <div class="flex gap-4 w-1/2 p-4">
            <Button text="-" handler={() => store.decrementAmount() } />
            <Button text="+" handler={() => store.incrementAmount() } />
        </div>
    </div>
</main>
