<script lang="ts">
    export let text: string
    export let handler: (e: MouseEvent) => void
</script>

<button 
    on:click={handler}
    class="text-white inline-flex justify-center items-center text-3xl w-7 h-7 bg-cyan-400 rounded-full">
    {text}
</button>
