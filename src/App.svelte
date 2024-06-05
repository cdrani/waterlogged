<script lang="ts">
    import Button from "./components/Button.svelte"
</script>

<main class="flex flex-col bg-white w-full h-full">
    <div class="flex flex-col p-4">
        <h1 class="text-gray-900 font-bold text-2xl">09:00 AM</h1>
        <h3 class="text-gray-500 font-semibold text-lg">300ml water</h3>
    </div>
    <div class="flex h-full bg-[#68B6FF]">
        <div class="flex gap-4 w-1/2 p-4">
            <Button text="+" handler={() => {}} />
            <Button text="-" handler={() => {}} />
        </div>
    </div>
</main>
