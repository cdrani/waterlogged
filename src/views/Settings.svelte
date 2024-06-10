<script lang="ts">
    import { onMount } from "svelte"

    import SettingsStore from '../stores/settings'

    export let port: any
    const store = new SettingsStore(port)

    onMount(async () => {
        return() => {
            port = null
            store.disconnect()
        }
    })
</script>

<section class="flex flex-col gap-4 bg-cyan-400 h-full w-full p-4">
    <form class="flex flex-col w-full gap-5">
        <label class="flex justify-between">
            <span class="text-[14px]">Enable Extension</span>
            <input type="checkbox" name="enabled" checked={true} />
        </label>

        <div class="flex justify-between w-full gap-x-6">
            <label class="flex flex-col w-1/2 gap-y-1">
                <span class="text-[14px]">Start Time</span>
                <input type="time" name="start_time" value="08:00" class="text-end" />
            </label>

            <label class="flex flex-col justify-end w-1/2 gap-y-1">
                <span class="text-[14px] text-end">End Time</span>
                <input type="time" name="end_time" value="18:00" class="text-end"/>
            </label>
        </div>

        <label class="flex justify-between gap-6">
            <span class="text-[14px] w-1/2">Measurement</span>
            <select name="measurement" value="ml" class="w-1/2 text-end">
                <option value="ml">ml</option>
                <option value="cup">cup</option>
            </select>
        </label>

        <div class="flex justify-between w-full gap-x-6">
            <label class="flex flex-col w-1/2 gap-y-1">
                <span class="text-[14px]">Goal (ml)</span>
                <input name="goal" type="number" value="1800" class="w-full text-end" />
            </label>

            <label class="flex flex-col w-1/2 gap-y-1">
                <span class="text-[14px] text-end">Intake (in ml)</span>
                <input name="intake" type="number" value="100" class="w-full text-end" />
            </label>
        </div>


        <label class="flex justify-between w-full">
            <span class="text-[14px]">Remind Every (mins)</span>
            <input name="interval" type="number" value="60" class="w-1/3 text-end" />
        </label>

        <label class="flex flex-col gap-y-1">
            <span>Reminder Alert Type</span>
            <select name="reminder" value="notification">
                <option value="notification">Notification</option>
                <!-- <option value="alarm">Alarm</option> -->
                <!-- <option value="both">Both</option> -->
            </select>
        </label>
    </form>
</section>
