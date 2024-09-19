<script lang="ts">
    import { onMount } from 'svelte'
    import { getAppVersion } from 'common/utils/version'

    let version: string = "v1.0.0"
    export let isApp: boolean = false
    export let manualUpdate: () => void

    async function getVersion() {
        version = await getAppVersion()
    }

    onMount(getVersion)
</script>

<!-- <div class="flex justify-between items-center"> -->
    <!-- <div> -->
    <!--     <p>Pause app</p> -->
    <!--     <p class="text-xs text-muted-foreground pe-24"> -->
    <!--         Your streaks are paused and will not -->
    <!--         break until you unpause the app -->
    <!--     </p> -->
    <!-- </div> -->
    <!-- <Switch -->
    <!--     checked={user?.pauseStreaks} -->
    <!--     onCheckedChange={updatePause} -->
    <!-- /> -->
<!-- </div> -->

<div class="flex flex-col w-full h-full mx-auto">
    <div class="flex w-full justify-between items-center bg-cyan-400 p-4 rounded-md mt-4 mb-5">
        <div class="flex flex-col">
            <p class="font-bold text-lg" class:pb-2={isApp}>{version}</p>

            {#if isApp}
                <div class="flex self-end">
                <button 
                    on:click|preventDefault={manualUpdate}
                    class="inline-flex text-sm justify-center self-center items-center w-24 xs:w-28 h-10 bg-white rounded-md"
                >
                    <span class="underline underline-offset-4 tracking-normal font-bold text-center text-black w-full">
                        Update App 
                    </span>
                </button>
                </div>
            {/if}
        </div>

        <a
            target="_blank"
            href="https://github.com/cdrani/waterlogged"
            class="inline-flex text-sm justify-end self-end items-center w-24 xs:w-28 h-10 {isApp ? 'bg-cyan-800' : 'bg-white'} rounded-md"
        >
            <span 
                class="underline underline-offset-4 tracking-wide font-bold text-center text-black w-full"
                class:text-white={isApp}
                class:track-normal={isApp}
            >
                View Code
            </span>
        </a>
    </div>

    <div class="flex-col w-full justify-between items-center bg-cyan-400 p-4 rounded-md">
        <p class="font-bold text-lg text-center">Questions | Suggestions</p>

        <div class="flex w-full justify-between items-center bg-cyan-400 rounded-md mt-4">
            <a
                target="_blank"
                href="https://forms.gle/SR72HpB9PawZLpjv7"
                class="inline-flex text-sm justify-center self-center items-center w-24 xs:w-28 h-10 bg-white rounded-md"
            >
                <span class="underline underline-offset-4 tracking-wide font-bold text-center text-black w-full">Feedback</span>
            </a>

            <a
                target="_blank"
                href="mailto:charlesdrani@gmail.com"
                class="inline-flex text-sm justify-center self-center items-center w-24 xs:w-28 h-10 bg-cyan-800 rounded-md"
            >
                <span class="underline underline-offset-4 tracking-wide font-bold text-center text-white w-full">Send Email</span>
            </a>
        </div>
    </div>
</div>
