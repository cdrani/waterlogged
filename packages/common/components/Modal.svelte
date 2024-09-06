<script lang="ts">
    import PopUp from './PopUp.svelte'
    import Congratulation from './Congratulation.svelte'
    import AddLogForm from './forms/log/AddLogForm.svelte'

    import { closeModal, getModal } from 'common/stores/modal'
    import { getParty, type PartyStore } from 'common/stores/party'

    const modal = getModal()
    const partyStore = getParty() as PartyStore

    function handleClose() {
        const view = $modal.view
        if (view == 'complete') (partyStore.partied = true)
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
