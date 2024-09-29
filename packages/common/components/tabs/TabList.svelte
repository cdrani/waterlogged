<script lang="ts">
    import { writable } from 'svelte/store'

    type Tab = { title: string, content: any, props?: any }
    export let tabs: Tab[] = []

    let activeTab = writable<string>(tabs[0].title)

    const setActiveTab = (tabTitle: string) => activeTab.set(tabTitle)

    const getStyles = (title: string) => {
        const rounding = tabs.at(0).title == title 
            ? 'rounded-tl-md' : tabs.at(-1).title == title
            ? 'rounded-tr-md' : ''
        return `${rounding} flex justify-center w-full text-center p-2 cursor-pointer bg-cyan-800 text-white hover:text-white`
    }
</script>

<style lang="postcss">
    .active {
        @apply bg-cyan-500 text-white border-white border-b-4 mt-1;
    }
</style>

<div class="flex-col w-full mx-auto items-center">
    <div role="tablist" class="flex w-full justify-between items-center divide-x-2 divide-white mx-auto">
        {#each tabs as tab (tab.title)}
            <button 
                role="tab" 
                class="{getStyles(tab.title)}"
                class:active={$activeTab == tab.title}
                on:click|preventDefault={() => setActiveTab(tab.title)}
                on:touchend|preventDefault={() => setActiveTab(tab.title)}
            >

                <span class="font-semibold text-base text-white">
                    {tab.title}
                </span>
            </button>
        {/each}
    </div>

    {#each tabs as tab (tab.title)}
        {#if $activeTab === tab.title}
            <svelte:component this={tab.content} {...tab?.props ?? {}} />
        {/if}
    {/each}
</div>
