<script lang="ts">
    import { clickOutside } from '../utils/click-outside'
    import { closeModal, getModal } from "../stores/modal";

    import CustomLogForm from './modal-views/CustomLogForm.svelte'
    import Congratulation from './modal-views/Congratulation.svelte'

    export let actionHandler: (e: SubmitEvent) => void | null
    const modal = getModal()

    $: visible = $modal.visible
    $: view = $modal.view
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
        <div class="relative flex flex-col w-[248px] mx-auto h-[200px] bg-cyan-500 rounded-md">
            <button class="absolute z-10 top-1 right-1 w-5 h-5 cursor justify-end" on:click={closeModal}>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                    <g fill="none" stroke="white" stroke-dasharray="22" stroke-dashoffset="22" stroke-linecap="round" stroke-width="3px">
                        <path d="M19 5L5 19">
                            <animate fill="freeze" attributeName="stroke-dashoffset" begin="0.3s" dur="0.3s" values="22;0" />
                        </path>
                        <path d="M5 5L19 19">
                            <animate fill="freeze" attributeName="stroke-dashoffset" dur="0.3s" values="22;0" />
                        </path>
                    </g>
                </svg>
            </button>

            {#if view == 'add' && actionHandler}
                <CustomLogForm onSubmit={actionHandler} />
            {:else if view == 'complete'}
                <Congratulation />
            {/if}
        </div>
    </div>
</div>
