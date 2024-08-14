<script lang="ts">
    import { writable } from 'svelte/store'
    import { resolveText, type DXCInputField, type DXCUserInteraction } from 'dexie-cloud-addon'

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
    <div
        role="alertdialog"
        aria-modal="true"
        class="fixed z-[100] w-full h-full overflow-y-hidden top-[184px] xs:top-1/2 -translate-y-1/2 shadow-black inset-0 flex mx-auto px-4 items-center content-center place-content-center"
    >
        <div class="absolute z-50 w-full">
            <div class="border-white border-2 absolute z-[100] inset-0 left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2 flex flex-col w-[248px] xs:w-11/12 lg:w-1/3 mx-auto min-h-[225px] xs:min-h-[320px]  bg-cyan-500 rounded-md">
                <button class="absolute z-[1001] top-1 right-1 w-5 h-5 cursor justify-end" on:click={handleCancel}>
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

                <form 
                    on:submit|preventDefault={handleSubmit}
                    class="absolute flex flex-col items-center mx-auto w-full h-full p-4 md:p-8 gap-4"
                >
                    <h1 class="align-left font-bold text-xl md:text-2xl capitalize">{ui.title}</h1>
                    <h3 class="text-md md:text-lg w-full leading-tight">
                        {#if ui.type == 'otp'}
                            Look for an email sent from <b class="underline">Dexie Cloud</b>
                        {:else if ui.type == 'email'}
                            We support passwordless authentication. Just
                            enter an email, paste the verification code
                            and you are logged in!
                        {/if}
                    </h3>

                    {#if ui.alerts.length > 0}
                        <div class="md:p-0 space-y-2 w-full">
                            {#each ui.alerts as alert}
                                <p class="text-center text-black w-full" class:text-red-500={alert.type == 'error'}>
                                    {resolveText(alert)}
                                </p>
                            {/each}
                        </div>
                    {/if}

                    <div class="flex flex-col justify-between w-full gap-x-6 gap-2 md:gap-4">
                        {#each fields as [fieldName, { type, label, placeholder }]}
                            <label for={fieldName} class="flex flex-col justify-between gap-x-8 gap-y-1">
                                <span class="text-lg font-bold">{label ?? 'Email'}</span>
                                <input
                                    id={fieldName}
                                    type={type}
                                    name={fieldName}
                                    placeholder={placeholder}
                                    class="{inputClass} w-1/2 h-[36px] text-lg"
                                    on:change={handleInputChange}
                                    value={params[fieldName] || ''}
                                />
                            </label>
                        {/each}
                    </div>

                    <div class="flex flex-end h-full w-full">
                        <div class="flex justify-end items-end w-full gap-4">
                            <button 
                                type="submit"
                                on:click|preventDefault={handleSubmit}
                                class="font-semibold w-20 h-9 bg-white rounded-md"
                            >
                                <span class="text-[16px] text-black">{ui.submitLabel}</span>
                            </button>

                            <button 
                                on:click={handleCancel}
                                class="w-20 h-9 bg-black rounded-md"
                            >
                                <span class="font-semibold text-[16px] text-white">{ui.cancelLabel}</span>
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    </div>
{/if}
