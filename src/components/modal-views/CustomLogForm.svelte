<script lang="ts">
    import { getToday } from '../../stores/today'
    import { closeModal } from '../../stores/modal'

    const todayStore = getToday()
    const inputClass = "px-0.5 pl-2 h-7 text-[14px] rounded-[4px]"

    function saveCustomLog(e: SubmitEvent) {
        const formData = new FormData(e.target as HTMLFormElement)
        const [time, amount] = [...formData.values()]
        const log = { time, amount }
        
        todayStore.logCustomAmount(log)
        closeModal()
    }

    $: today = todayStore.today

    const getTime = () => {
        const date = new Date()
        const minutes = date.getMinutes()
        const hours = date.getHours()
        const paddedMinutes = minutes <= 9 ? `0${minutes}` : minutes
        const paddedHours = hours <= 9 ? `0${hours}` : hours
        return `${paddedHours}:${paddedMinutes}`
    }
</script>

<form on:submit|preventDefault={saveCustomLog} class="absolute flex flex-col h-full p-4 pt-6">
    <h1 class="text-center text-white text-xl font-bold">Log Custom Amount</h1>
    <div class="flex flex-col justify-between w-full gap-x-6 gap-4 mt-4">
        <label for="time" class="flex justify-between items-center gap-y-1">
            <span class="text-white text-[16px]">Log Time</span>
            <input
                id="time"
                type="time" 
                name="time"
                value={getTime()}
                class="{inputClass} w-1/2"
            />
        </label>

        <label for="amount" class="flex justify-between items-center gap-y-1">
            <span class="text-white text-[16px]">Amount ({$today.measurement})</span>
            <input id="amount" name="amount" type="number" value={$today.amount} class="w-1/2 {inputClass}" />
        </label>
    </div>

    <button 
        type="submit"
        class="absolute bottom-4 right-4 w-16 h-7 bg-white rounded-md"
    >
        <span class="text-[16px] text-black">Save</span>
    </button>
</form>
