<script lang="ts">
    import PopUp from './PopUp.svelte'
    import Congratulation from './Congratulation.svelte'
    import AddLogForm from './forms/log/AddLogForm.svelte'

    import { endParty } from 'common/stores/party'
    import { closeModal, getModal } from 'common/stores/modal'

    const modal = getModal()

    function handleClose() {
        const view = $modal.view
        if (view == 'complete') endParty()
        closeModal()
    }
</script>

{#if $modal.visible}
    <PopUp onClose={handleClose}>
        {#if $modal.view == 'add'}
            <AddLogForm />
        {:else if $modal.view == 'complete'}
            <Congratulation />
        {/if}
    </PopUp>
{/if}
