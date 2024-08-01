<script lang="ts">
    import { playAlarm } from 'common/utils/alarm'
    import Toggle from 'common/components/Toggle.svelte'
    import { type SettingsStore, getSettings } from 'common/stores/settings'

    const store = getSettings() as SettingsStore
    $: settings = store.data

    function handleInput(e: Event) {
        const target = e.target as HTMLSelectElement | HTMLSelectElement
        const { name: key , value: rawValue } = target
        const value = ['goal', 'interval', 'amount'].includes(key) ? Number(rawValue) : rawValue
        store.updateSetting({ key, value })
    }

    function handleToggle(event: CustomEvent) {
        const state = event.detail
        store.updateSetting(state)
    }

    function playSound() {
        playAlarm($settings.sound)
    }

    const inputClass = "px-0.5 pl-2 h-7 text-[14px] rounded-[4px]"
</script>

{#if $settings}
<section class="flex relative left-0 flex-col mx-auto w-full h-[340px] max-h-[358] bg-cyan-200">
    <div class="relative flex flex-col w-full mx-auto overflow-y-auto h-full">
        <form class="relative flex flex-col gap-3 p-4 pt-0 w-full mx-auto">
            <div class="flex justify-between items-center bg-cyan-500 py-2 px-4 rounded-md">
                <span class="text-[14px]">Enabled</span>
                <Toggle name="enabled" on:toggle={handleToggle} enabled={$settings.enabled} />
            </div>

            <div class="flex justify-between w-full gap-x-6 bg-cyan-500 p-4 rounded-md">
                <label class="flex flex-col w-1/2 gap-y-1">
                    <span class="text-[14px]">Start Time</span>
                    <input
                        type="time" name="start_time" value={$settings.start_time}
                        class="{inputClass}"
                        on:change={handleInput}
                    />
                </label>

                <label class="flex flex-col justify-end w-1/2 gap-y-1">
                    <span class="text-[14px]">End Time</span>
                    <input type="time" name="end_time" value={$settings.end_time}
                        class="{inputClass}"
                        on:change={handleInput}
                    />
                </label>
            </div>

            <div class="flex justify-between w-full gap-x-6 bg-cyan-500 p-4 rounded-md">
                <label class="flex flex-col w-1/2 gap-y-1">
                    <span class="text-[14px]">Daily Goal (ml)</span>
                    <input name="goal" type="number" value={$settings.goal} class="w-full {inputClass}"
                        on:change={handleInput}
                    />
                </label>

                <label class="flex flex-col w-1/2 gap-y-1">
                    <span class="text-[14px]">Amount (ml)</span>
                    <input name="amount" type="number" value={$settings.amount} class="w-full {inputClass}"
                        on:change={handleInput}
                    />
                </label>
            </div>

            <label class="flex justify-between items-center w-full gap-x-6 bg-cyan-500 p-4 rounded-md">
                <span class="text-[14px] w-1/2">Interval (mins)</span>
                <input name="interval" type="number" value={$settings.interval} class="w-1/2 {inputClass}"
                        on:change={handleInput}
                />
            </label>

            <label class="flex justify-between items-center gap-y-1 gap-x-6 bg-cyan-500 p-4 rounded-md">
                <span class="text-[14px] w-1/2">Alert Type</span>
                <select name="alert_type" value={$settings.alert_type} class="w-1/2 {inputClass}"
                        on:change={handleInput}
                >
                    <option value="notify">Notify</option>
                    <option value="alarm">Alarm</option>
                    <option value="both">Both</option>
                    <option value="none">None</option>
                </select>
            </label>

            <div class="flex flex-col justify-between gap-y-2 bg-cyan-500 rounded-md p-4">
                <label class="flex justify-between gap-y-1 gap-x-6">
                    <div class="flex items-center w-1/2">
                        <span class="text-[14px] mr-3">Sound</span>
                        <button class="inline-flex items-center place-content-center rounded-full w-6 h-6 bg-white" on:click|preventDefault={playSound}>
                            <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" viewBox="0 0 24 24">
                                <path fill="currentColor" d="M15.533 16.414h-3.694l-2.672 2.67q-.46.46-1.143.46t-1.143-.46l-1.96-1.959q-.46-.46-.46-1.146q0-.687.46-1.146l2.666-2.647V8.473zm-2.421-1l-4.526-4.526v1.7L5.63 15.547q-.173.173-.173.433t.173.433l1.96 1.96q.172.172.432.172t.433-.173l2.957-2.957zM8.147 5.182q2.329-1.2 4.893-.853q2.565.347 4.411 2.193t2.193 4.41t-.853 4.894l-.758-.738q.952-1.993.605-4.146t-1.9-3.706q-1.555-1.554-3.707-1.901t-4.146.605zm2.623 2.623q1.175-.252 2.318.027q1.142.279 1.98 1.117t1.115 1.978t.005 2.295l-.854-.854q.038-.76-.197-1.462q-.236-.703-.776-1.243q-.546-.547-1.25-.795t-1.468-.171zm-1.513 6.936" />
                            </svg>
                        </button>
                    </div>
                    <select name="sound" value={$settings.sound} class="w-1/2 {inputClass}"
                            on:change={handleInput}
                    >
                        <option value="bubble1">Bubble #1</option>
                        <option value="bubble2">Bubble #2</option>
                    </select>
                </label>

                <span class="text-[11px] font-medium leading-tight">
                    *Audio will only play if Alert Type is "Alarm" or "Both"
                </span>
            </div>
        </form>
    </div>
</section>
{/if}
