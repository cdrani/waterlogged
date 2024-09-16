<script lang="ts">
    export let onClose: () => void
    export let submitLabel: string = 'Save'
    export let cancelLabel: string = 'Cancel'
</script>

<div class="flex flex-end h-full w-full">
    <div class="flex justify-end items-end w-full gap-4">
        <button 
            on:click|preventDefault={onClose}
            on:touchend|preventDefault={onClose}
            class="w-20 h-9 bg-black rounded-md"
        >
            <span class="font-semibold text-[14px] md:text-[16px] text-white">{cancelLabel}</span>
        </button>

        <button 
            type="submit"
            class="w-20 h-9 bg-white rounded-md"
        >
            <span class="font-semibold text-[14px] md:text-[16px] text-black">{submitLabel}</span>
        </button>
    </div>
</div>
