<script lang="ts">
    import { getSettings } from '../stores/settings'
    import Toggle from '../components/Toggle.svelte'

    const store = getSettings()
    $: settings = store.settings

    function handleInput(e: Event) {
        let { name: key , value } = e.target
        value = key == 'interval' ? Number(value) : value
        store.updateSetting({ key, value })
    }

    function handleToggle(event: CustomEvent) {
        const state = event.detail
        store.updateSetting(state)
    }

    const inputClass = "px-0.5 h-7 text-[14px] rounded-[4px]"
</script>

<section class="flex flex-col gap-4 bg-cyan-400 h-full w-full p-4 rounded-md">
    <form class="flex flex-col w-full gap-4">
        <div class="flex justify-between">
            <span class="text-[14px]">Enabled</span>
            <Toggle name="enabled" on:toggle={handleToggle} enabled={$settings.enabled} />
        </div>

        <div class="flex justify-between w-full gap-x-6">
            <label class="flex flex-col w-1/2 gap-y-1">
                <span class="text-[14px]">Start Time</span>
                <input
                    type="time" name="start_time" value={$settings.start_time}
                    class="text-end {inputClass}"
                    on:change={handleInput}
                />
            </label>

            <label class="flex flex-col justify-end w-1/2 gap-y-1">
                <span class="text-[14px] text-end">End Time</span>
                <input type="time" name="end_time" value={$settings.end_time}
                    class="text-end {inputClass}"
                    on:change={handleInput}
                />
            </label>
        </div>

        <label class="flex justify-between gap-6">
            <span class="text-[14px] w-1/2">Measurement</span>
            <select name="measurement" value={$settings.measurement} class="w-1/2 text-end {inputClass}"
                on:change={handleInput}
            >
                <option value="ml">ml</option>
                <option value="cup">cup</option>
            </select>
        </label>

        <div class="flex justify-between w-full gap-x-6">
            <label class="flex flex-col w-1/2 gap-y-1">
                <span class="text-[14px]">Goal (ml)</span>
                <input name="goal" type="number" value={$settings.goal} class="w-full text-end {inputClass}"
                    on:change={handleInput}
                />
            </label>

            <label class="flex flex-col w-1/2 gap-y-1">
                <span class="text-[14px] text-end">Intake (in ml)</span>
                <input name="intake" type="number" value={$settings.intake} class="w-full text-end {inputClass}"
                    on:change={handleInput}
                />
            </label>
        </div>


        <label class="flex justify-between w-full gap-x-6">
            <span class="text-[14px] w-1/2">Timer (mins)</span>
            <input name="interval" type="number" value={$settings.interval} class="w-1/2 text-end {inputClass}"
                    on:change={handleInput}
            />
        </label>

        <label class="flex justify-between gap-y-1 gap-x-6">
            <span class="text-[14px] w-1/2">Alert Type</span>
            <select name="alert_type" value={$settings.alert_type} class="w-1/2 text-end {inputClass}"
                    on:change={handleInput}
            >
                <option value="notify">Notify</option>
                <option value="alarm">Alarm</option>
                <option value="both">Both</option>
                <option value="none">None</option>
            </select>
        </label>
    </form>
</section>
