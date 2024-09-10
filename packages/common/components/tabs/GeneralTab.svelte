<script lang="ts">
    import { VERSION } from 'common/utils/version'
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

<div class="flex flex-col w-full mx-auto">
    <div class="flex w-full justify-between items-center bg-cyan-400 p-4 rounded-md my-4">
        <p class="font-bold text-md">{VERSION}</p>
        <a
            target="_blank"
            href="https://github.com/cdrani/waterlogged/issues"
            class="inline-flex text-sm justify-center self-center items-center w-28 h-10 bg-white rounded-md"
        >
            <span class="underline underline-offset-4 tracking-wide font-bold text-center text-black w-full">View Code</span>
        </a>
    </div>

    <div class="flex-col w-full justify-between items-center bg-cyan-400 p-4 rounded-md">
        <p class="font-bold text-md text-center">Questions | Suggestions</p>

        <div class="flex w-full justify-between items-center bg-cyan-400 rounded-md my-4">
            <a
                target="_blank"
                href="https://forms.gle/SR72HpB9PawZLpjv7"
                class="inline-flex text-sm justify-center self-center items-center w-28 h-10 bg-white rounded-md"
            >
                <span class="underline underline-offset-4 tracking-wide font-bold text-center text-black w-full">Feedback</span>
            </a>

            <a
                target="_blank"
                href="mailto:charlesdrani@gmai.com"
                class="inline-flex text-sm justify-center self-center items-center w-28 h-10 bg-cyan-800 rounded-md"
            >
                <span class="underline underline-offset-4 tracking-wide font-bold text-center text-white w-full">Send Email</span>
            </a>
        </div>
    </div>
</div>
