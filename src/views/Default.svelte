<script lang="ts">
    import { onMount } from "svelte"

    import Aquarium from "../components/Aquarium.svelte"
    import LogList from "../components/LogList.svelte"

    import TodayStore from '../stores/today'

    export let port: any
    const store = new TodayStore(port)

    onMount(async () => {
        return() => {
            port = null
            store.disconnect()
        }
    })
</script>

<div>
    <Aquarium store={store} />
    <LogList store={store} />
</div>
