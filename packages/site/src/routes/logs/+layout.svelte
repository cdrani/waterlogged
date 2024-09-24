<script lang="ts">
    import { initParty } from 'common/stores/party'
    import { initModal } from 'common/stores/modal'

    import Modal from 'common/components/Modal.svelte'
    import Celebrate from 'common/components/Celebrate.svelte'

    initModal()
    initParty()
</script>

<main id="main" class="absolute flex left-1/2 -translate-x-1/2 justify-center items-center gap-4 xl:gap-8 bg-transparent w-full md:w-11/12 md:max-w-[65rem] lg:max-w-[90rem] mx-auto px-4 xs:px-0 sm:px-6 md:px-8 lg:px-0 h-full md:py-16 md:max-h-[calc(100vh-48px)] overflow-hidden">
    <slot></slot>
</main>

<Modal />
<Celebrate />
