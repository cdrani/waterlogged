<script>
    export let date
    export let count
    export let color

    const formatDate = (inputDate) => (
        new Date(inputDate).toLocaleDateString(
            undefined, { month: 'long', day: 'numeric', weekday: 'long' }
        )
    )
</script>

<li class="square" style="background-color: {color}">
    {#if count > 0}
        <p class="tooltip">
            {formatDate(date)}: {count} {count === 1 ? 'contribution' : 'contributions'}
        </p>
    {/if}
</li>
