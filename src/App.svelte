<script lang="ts">
    import { writable } from "svelte/store";
    import Button from "./components/Button.svelte"
    import CurrentTime from "./components/CurrentTime.svelte";

    const waterMeasurement = writable<'ml' | 'cup'>('ml')
    const waterIntake = writable<number>(300)

    function incrementAmount() {
        const amount = $waterMeasurement == 'ml' ? 100 : 1
        waterIntake.update(previousAmount => previousAmount + amount)
    }
    
    function decrementAmount() {
        const amount = $waterMeasurement == 'ml' ? 100 : 1
        waterIntake.update(previousAmount => Math.max(0, previousAmount - amount))
    }
</script>

<main class="flex flex-col bg-white w-full h-full">
    <div class="flex flex-col p-4">
        <CurrentTime />
        <h3 class="text-gray-500 font-semibold text-lg">{$waterIntake}{$waterMeasurement} drank</h3>
    </div>
    <div class="flex h-full bg-[#68B6FF]">
        <div class="flex gap-4 w-1/2 p-4">
            <Button text="-" handler={decrementAmount} />
            <Button text="+" handler={incrementAmount} />
        </div>
    </div>
</main>
