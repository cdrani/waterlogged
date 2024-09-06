<script lang="ts">
    import type { INTAKE } from 'common/types'
    import FormActions from '../FormActions.svelte'

    type FormType = 'edit' | 'create'

    export let onClose: () => void
    export let onSubmit: () => void
    export let fields: Partial<INTAKE>
    export let type: FormType = 'create'

    const title = `${type == 'create' ? 'Log' : 'Edit'} Custom Intake`
    const inputClass = 'px-0.5 pl-2 h-7 text-[14px] xs:text-md md:text-lg font-semibold rounded-[4px]'
</script>

<form on:submit|preventDefault={onSubmit} class="fixed flex flex-col w-full h-full gap-2 md:gap-6 p-4 md:p-10">
    <h1 class="text-center text-white text-xl lg:text-2xl font-bold">{title}</h1>
    <div class="flex flex-col justify-between w-full gap-x-6 gap-4 mt-4">
        <label for="time" class="flex justify-between items-center gap-y-1">
            <span class="text-white text-[16px] md:text-lg font-bold">Time</span>
            <input
                id="time"
                type="time" 
                name="time"
                bind:value={fields.time}
                class="{inputClass} w-1/2"
            />
        </label>

        <label for="amount" class="flex justify-between items-center gap-y-1">
            <span class="text-white text-[16px] md:text-lg font-bold">Amount (ml)</span>
            <input 
                id="amount"
                name="amount"
                type="number"
                class="{inputClass} w-1/2"
                bind:value={fields.amount}
            />
        </label>
    </div>

    <FormActions onClose={onClose} />
</form>
