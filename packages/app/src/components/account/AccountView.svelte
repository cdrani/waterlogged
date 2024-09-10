<script lang="ts">
    import { db } from 'common/data/db'
    import AdvancedTab from './AdvancedTab.svelte'
    import TabList from 'common/components/tabs/TabList.svelte'
    import GeneralTab from 'common/components/tabs/GeneralTab.svelte'
    import AccountTab from 'common/components/tabs/AccountTab.svelte'

    let tabs = [
        { title: 'General', content: GeneralTab },
        { title: 'Advanced', content: AdvancedTab }
     ]

    let userId = db.cloud.currentUserId

    $: if (userId) {
        if (userId !== 'unauthorized') {
            tabs = tabs.toSpliced(1, 0, { title: 'Account', content: AccountTab })
        }
    }
</script>

<section class="flex relative left-0 flex-col mx-auto w-full h-[340px] max-h-[358] xs:pb-6 xs:h-full bg-cyan-200">
    <div class="relative flex flex-col w-full mx-auto">
        <div class="flex mx-auto w-full px-6">
            <TabList {tabs} />
        </div>
    </div>
</section>

