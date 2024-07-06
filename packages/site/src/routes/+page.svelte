<script lang="ts">
    import Tank from 'common/components/Tank.svelte'

    let tank = {
        total: 1500,
        waterLevel: 75,
        goal: 2000,
        measurement: 'ml'
    }
</script>

<main class="flex flex-col w-full h-full lg:max-w-screen-xl mx-auto p-5 md:p-8 xl:p-16 my-10">
    <section class="flex flex-col xl:flex-row-reverse w-full gap-8 h-full">
        <div class="flex flex-col justify-evenly gap-6 w-full h-full xl:w-1/2">
            <article class="flex justify-center items-center flex-col gap-3 lg:gap-8 w-full">
                <h1 class="text-left text-wrap h-fit leading-none text-blue-800 font-bold text-5xl md:text-[6rem] xl:text-[6rem]">
                    WaterLogged
                </h1>
                <h2 class="text-wrap text-left mt-0 leading-none text-blue-800 font-bold text-3xl md:text-[3.75rem] xl:text-6xl">
                    Tracker & Reminder
                </h2>
            </article>

            <div class="flex justify-center xl:justify-between gap-4 xl:gap-6 w-full h-10 md:h-12">
                <button class="rounded-3xl w-32 lg:w-48 xl:w-72 bg-orange-400 text-[1rem] xl:text-2xl text-white font-semibold">Chrome</button>
                <button class="rounded-3xl w-32 lg:w-48 xl:w-72 bg-yellow-400 text-[1rem] xl:text-2xl text-white font-semibold">FireFox</button>
                <button class="rounded-3xl w-32 lg:w-48 xl:w-72 bg-blue-400 text-[1rem] xl:text-2xl text-white font-semibold">Desktop</button>
            </div>
        </div>

        <div class="grid grid-cols-2 gap-4 p-4 w-full xl:w-1/2 border-4 border-white">
                <Tank tank={tank} />
                <Tank tank={tank} />
        </div>
    </section>

    <section class="flex flex-col justify-center w-full h-full py-12 xl:py-10 xl:pt-16 gap-12 xl:gap-16">
        <h3 class="text-white text-center text-5xl xl:text-7xl font-semibold">Features</h3>
        <div class="flex flex-col md:flex-row-reverse justify-between items-center w-full h-[28rem] md:h-[20rem] xl:h-[32rem] gap-4 md:gap-10 xl:gap-16">
            <div class="w-full md:w-1/2 h-full bg-pink-400">

            </div>
            <div class="w-full md:w-1/2">
                <article class="prose">
                    <h4 class="text-white text-center font-semibold text-3xl md:text-4xl xl:text-5xl">Quick Visual of Progress</h4>
                    <p class="text-white text-lg md:text-2xl xl:text-4xl font-sans font-thin">
                        View your daily goal and current progress.
                        Keep track of intake times to develop a mental pattern of when to take your next drink.
                    </p>
                </article>
            </div>
        </div>

        <div class="flex flex-col md:flex-row justify-between items-center w-full h-[28rem] md:h-[20rem] xl:h-[32rem] gap-4 md:gap-10 xl:gap-16">
            <div class="w-full md:w-1/2 h-full bg-red-600">
                <Tank tank={tank} />
            </div>

            <div class="w-full md:w-1/2">
                <article class="prose">
                    <h4 class="text-white text-center font-semibold text-3xl md:text-4xl xl:text-5xl">Custom Start & End Times</h4>
                    <p class="text-white text-lg md:text-2xl xl:text-4xl font-sans font-thin">
                        Set it for your needs, such as working hours,
                        or times you want to be more attentive to your hydration.
                    </p>
                </article>
            </div>
        </div>

        <div class="flex flex-col md:flex-row-reverse justify-between items-center w-full h-[28rem] md:h-[20rem] xl:h-[32rem] gap-4 md:gap-10 xl:gap-16">
            <div class="w-full md:w-1/2 h-full bg-green-600">

            </div>
            <div class="w-full md:w-1/2">
                <article class="prose">
                    <h4 class="text-white text-center font-semibold text-3xl md:text-4xl xl:text-5xl">Custom Alert Types</h4>
                    <p class="text-white text-lg md:text-2xl xl:text-4xl font-sans font-thin">
                        Choose between a notification, gentle alert sounds, or both.
                        Optionally, choose none of the above, and drink when you feel thirsty.
                    </p>
                </article>
            </div>
        </div>
    </section>
</main>

<footer class="fixed bottom-0 flex w-full h-12 bg-gray-800">
</footer>
