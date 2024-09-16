<script lang="ts">
    import { writable } from 'svelte/store'
    import { resolveText, type DXCInputField, type DXCUserInteraction } from 'dexie-cloud-addon'

    import PopUp from '../../PopUp.svelte'
    import FormActions from '../FormActions.svelte'

    export let ui: DXCUserInteraction

    let params = writable<{ [param: string]: string }>({})
    let fields = (Object.entries(ui.fields) as [string, DXCInputField][])

    const inputClass = 'px-0.5 pl-2 h-7 text-[14px] rounded-[4px] w-full'

    const handleSubmit = () => ui?.onSubmit($params)

    const handleCancel = () => ui?.onCancel()

    const handleInputChange = (event: Event) => {
        const target = event.currentTarget as HTMLInputElement
        const { name, value } = target
        params.update(previous => ({ ...previous, [name]: value }))
    }
</script>

{#if ui}
    <PopUp onClose={handleCancel}>
        <form 
            on:submit|preventDefault={handleSubmit}
            class="absolute flex flex-col items-center mx-auto w-full h-full p-4 md:p-8 gap-2 md:gap-4"
        >
            <h1 class="align-left font-bold text-lg md:text-xl lg:text-2xl capitalize">{ui.title}</h1>
            <h3 class="text-[14px] md:text-lg font-medium w-full leading-tight">
                {#if ui.type == 'otp'}
                    Look for an email sent from <b class="underline">Dexie Cloud</b>
                {:else if ui.type == 'email'}
                    Passwordless login available. Enter your email, verify with the code, and you're in!
                {/if}
            </h3>

            {#if ui.alerts.length > 0}
                <div class="md:p-0 space-y-2 w-full">
                    {#each ui.alerts as alert}
                        <p class="font-medium text-black w-full text-[14px] md:text-lg" class:text-red-500={alert.type == 'error'}>
                            {resolveText(alert)}
                        </p>
                    {/each}
                </div>
            {/if}

            <div class="flex flex-col justify-between w-full gap-x-6 gap-2 md:gap-4">
                {#each fields as [fieldName, { type, label, placeholder }]}
                    <label for={fieldName} class="flex flex-col justify-between gap-x-8 gap-y-1">
                        <span class="text-[14px] md:text-lg font-bold">{label ?? 'Email'}</span>
                        <input
                            id={fieldName}
                            type={type}
                            name={fieldName}
                            placeholder={placeholder}
                            class="{inputClass} w-1/2 md:h-[36px] text-[14px] md:text-lg"
                            on:change={handleInputChange}
                            value={params[fieldName] || ''}
                        />
                    </label>
                {/each}
            </div>

            <FormActions 
                onClose={handleCancel}
                submitLabel={ui.submitLabel}
                cancelLabel={ui.cancelLabel}
            />
        </form>
    </PopUp>
{/if}
