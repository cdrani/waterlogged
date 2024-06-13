<script lang="ts">
    import Aquarium from "../components/Aquarium.svelte"
    import LogList from "../components/LogList.svelte"

    export let store
</script>
<div>
    <Aquarium store={store} />
    <LogList store={store} />
</div>
