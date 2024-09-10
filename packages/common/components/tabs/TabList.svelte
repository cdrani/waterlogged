<script lang="ts">
    import { writable } from 'svelte/store'

    type Tab = { title: string, content: any }
    export let tabs: Tab[] = []

    let activeTab = writable<string>(tabs[0].title)

    const setActiveTab = (tabTitle: string) => activeTab.set(tabTitle)

    const getStyles = (title: string) => {
        const rounding = tabs.at(0).title == title 
            ? 'rounded-tl-md' : tabs.at(-1).title == title
            ? 'rounded-tr-md' : ''
        return `${rounding}  w-full text-center px-4 py-2 cursor-pointer bg-cyan-800 text-white hover:text-white`
    }
</script>

<style lang="postcss">
    .active {
        @apply bg-cyan-500 text-white border-white border-b-4 mt-1;
    }
</style>

<div class="flex-col w-full mx-auto items-center">
    <div role="tablist" class="relative flex w-full place-items-center">
        {#each tabs as tab (tab.title)}
            <a role="tab" 
                class="{getStyles(tab.title)}"
                class:active={$activeTab == tab.title}
                on:click|preventDefault={() => setActiveTab(tab.title)}
                on:touchend|preventDefault={() => setActiveTab(tab.title)}
            >
                {tab.title}
            </a>
        {/each}
    </div>

    {#each tabs as tab (tab.title)}
        {#if $activeTab === tab.title}
            <svelte:component this={tab.content} />
        {/if}
    {/each}
</div>
