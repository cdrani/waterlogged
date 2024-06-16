<script lang="ts">
    import { getToday } from '../../stores/today'
    import { closeModal } from '../../stores/modal'

    const todayStore = getToday()
    const inputClass = "px-0.5 h-7 text-[14px] rounded-[4px]"


    function saveCustomLog(e: SubmitEvent) {
        const formData = new FormData(e.target as HTMLFormElement)
        const [time, amount] = [...formData.values()]
        const log = { time, amount }
        
        todayStore.logCustomIntake(log)
        closeModal()
    }
</script>

<form on:submit|preventDefault={saveCustomLog} class="absolute flex flex-col h-full p-4 pt-6">
    <h1 class="text-center text-white text-xl font-bold">Log New Intake</h1>
    <div class="flex flex-col justify-between w-full gap-x-6 gap-4 mt-4">
        <label for="time" class="flex justify-between items-center gap-y-1">
            <span class="text-white text-[16px]">Log Time</span>
            <input
                id="time"
                type="time" name="time" value="17:38"
                class="text-end {inputClass} w-1/2"
            />
        </label>

        <label for="amount" class="flex justify-between items-center gap-y-1">
            <span class="text-white text-[16px] text-end">Amount (ml)</span>
            <input id="amount" name="amount" type="number" value={250} class="w-1/2 text-end {inputClass}" />
        </label>
    </div>

    <button 
        type="submit"
        class="absolute bottom-4 right-4 w-16 h-7 bg-white rounded-md"
    >
        <span class="text-[16px] text-black">Save</span>
    </button>
</form>
