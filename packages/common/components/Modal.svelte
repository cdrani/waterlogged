<script lang="ts">
    import { type LogStore, getLog } from 'common/stores/log'
    import { clickOutside } from 'common/utils/click-outside'
    import { closeModal, getModal } from 'common/stores/modal'

    import CustomLogForm from './CustomLogForm.svelte'
    import Congratulation from './Congratulation.svelte'

    const modal = getModal()
    const logStore = getLog() as LogStore

    function handleClose() {
        const view = $modal.view
        if (view == 'complete') (logStore.partied = true)
        closeModal()
    }
</script>

<div
    id="modal"
    role="alertdialog"
    aria-modal="true"
    class="fixed z-[100] w-full h-full {$modal.visible
        ? 'block overflow-y-hidden'
        : 'hidden overflow-y-hidden'} top-[184px] -translate-y-1/2 shadow-black z-[10] inset-0 flex w-full h-full mx-auto px-4 items-center content-center place-content-center"
>
    <div
        id="modal-content"
        class="absolute z-50"
        use:clickOutside
        on:click_outside={handleClose}
    >
        <div class="relative flex flex-col w-[248px] mx-auto h-[225px] bg-cyan-500 rounded-md">
            <button class="absolute z-10 top-1 right-1 w-5 h-5 cursor justify-end" on:click={handleClose}>
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

            {#if $modal.view == 'add'}
                <CustomLogForm />
            {:else if $modal.view == 'complete'}
                <Congratulation />
            {/if}
        </div>
    </div>
</div>
