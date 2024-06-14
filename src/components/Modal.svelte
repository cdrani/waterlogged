<script lang="ts">
    import { clickOutside } from '../utils/click-outside'
    import { closeModal, getModal } from "../stores/modal";

    type View = 'add' | 'edit' | 'complete' | 'help'
    export let view: View = 'add'
    const modal = getModal()
    $: visible = $modal.visible
</script>

<div
    id="modal"
    role="alertdialog"
    aria-modal="true"
    class="fixed w-full h-full shadow-black {visible
        ? 'block overflow-y-hidden'
        : 'hidden overflow-y-hidden'} top-1/2 -translate-y-1/2 shadow-black z-[10] inset-0 flex w-full h-full mx-auto px-4 items-center content-center place-content-center"
>
    <div
        id="modal-content"
        class="absolute z-50"
        use:clickOutside
        on:click_outside={closeModal}
    >
        <div class="relative flex flex-col w-[248px] mx-auto h-full bg-yellow-500">
            <h1>Modal</h1>
            <h1>Modal</h1>
            <h1>Modal</h1>
            <h1>Modal</h1>
            <h1>Modal</h1>
            <h1>Modal</h1>
            <h1>Modal</h1>
            <h1>Modal</h1>
            <h1>Modal</h1>
            <h1>Modal</h1>
        </div>
    </div>
</div>
