<script lang="ts">
    export let exportData: () => Promise<void>
    export let importData: (file: File) => Promise<void>

    async function importFile(event: Event) {
        const target = event.target as HTMLInputElement
        const file = target.files?.[0]
        if (!file) {
            alert('Invalid file. File must be a dexie compatible json type')
            return
        }

        await importData(file)
        location.reload()
    }

    function inputClick() {
        document.getElementById('input').click()
    }
</script>

<div class="relative flex flex-col w-full h-full mx-auto items-center py-4">
    <div class="relative flex flex-col w-full justify-between items-center bg-cyan-400 p-4 mx-auto rounded-md">
        <h2 class="font-bold text-xl">Data Control</h2>
        <p>Use the buttons below to export and import your data.<p>
    </div>

    <div class="relative flex w-full justify-between items-center bg-cyan-400 p-4 mx-auto rounded-md my-4">
        <button 
            on:click|preventDefault={exportData}
            on:touchend|preventDefault={exportData}
            class="inline-flex justify-center self-center items-center w-28 h-10 bg-white rounded-md"
        >
            <span class="font-bold text-sm text-black w-full">Export Data</span>
        </button>

        <button 
            on:click|preventDefault={inputClick}
            on:touchend|preventDefault={inputClick}
            class="inline-flex justify-center self-center items-center w-28 h-10 bg-cyan-800 rounded-md"
        >
            <span class="font-bold text-sm text-white w-full">Import Data</span>
        </button>

        <input id="input" type="file" class="hidden w-[250px] mt-1" on:change={importFile} />
    </div>
</div>
