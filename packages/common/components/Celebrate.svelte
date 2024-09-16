<script lang="ts">
    import { Confetti } from 'svelte-confetti'

    export let party: boolean = false 
</script>

{#if party}
    <div class="fixed pointer-events-none h-screen w-screen flex justify-center left-0 top-[-50px] z-[100]">
        <Confetti x={[-5, 5]} y={[0, 0.1]} infinite duration={5000} amount={2000} fallDistance="300vh" />
    </div>
{/if}
