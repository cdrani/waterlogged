<script lang="ts">
    import { clickOutside } from 'common/utils/click-outside'

    export let onClose: () => void

    const onKeyDown = (e: KeyboardEvent) => e.key == 'Escape' && onClose()
</script>

<svelte:window on:keydown={onKeyDown} />

<div
    aria-modal="true"
    role="alertdialog"
    class="fixed z-[100] w-full h-full py-10 overflow-y-hidden backdrop-brightness-50 backdrop-opacity-75 backdrop-blur-sm top-[184px] xs:top-1/2 -translate-y-1/2 shadow-black inset-0 flex mx-auto px-4 items-center content-center place-content-center"
>
    <div
        use:clickOutside
        on:click_outside={onClose}
        class="absolute z-50 w-full max-w-[90rem]"
    >
        <div class="border-white border-2 absolute z-[100] inset-0 left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2 flex flex-col w-[248px] xs:w-11/12 lg:w-1/3 mx-auto h-[225px] xs:h-[250px] md:h-[320px] lg:min-h-[360px]  bg-cyan-500 rounded-md">
            <button class="absolute z-[1001] top-1 right-1 w-5 h-5 xs:w-7 xs:h-7 cursor justify-end" on:click={onClose}>
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
        
            <slot></slot>
        </div>
    </div>
</div>
