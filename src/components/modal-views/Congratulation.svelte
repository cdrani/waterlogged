<script lang="ts">
    import { closeModal } from "../../stores/modal"
</script>

<section class="absolute flex flex-col h-full p-4 pt-6">
    <h1 class="text-center text-white text-xl font-bold">Congratulations!</h1>
    <h2 class="text-center text-white text-lg font-medium">You hit your daily goal!</h2>

    <h4 class="text-center text-white text-[13px] mt-3">
        Keep your streak going tomorrow!
        Adjust your targets as necessary.
    </h4>

    <button 
        on:click={closeModal}
        class="absolute bottom-4 right-4 w-16 h-7 bg-white rounded-md"
    >
        <span class="text-[16px] text-black">Close</span>
    </button>
</section>
