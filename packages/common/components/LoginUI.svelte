<script lang="ts">
    import { db } from 'common/data/db'
    import LoginForm from './forms/auth/LoginForm.svelte'

    const ui = db.cloud.userInteraction
</script>

{#if $ui}
    <LoginForm ui={$ui} />
{/if}
