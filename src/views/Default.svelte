<script lang="ts">
    import { onMount } from "svelte"

    import Aquarium from "../components/Aquarium.svelte"
    import LogList from "../components/LogList.svelte"

    import DataStore from '../stores'

    export let port: any
    const store = new DataStore(port)

    onMount(async () => {
        return() => {
            port = null
            store.disconnect()
        }
    })

</script>

<div>
    <Aquarium port={port} />
    <LogList />
</div>
