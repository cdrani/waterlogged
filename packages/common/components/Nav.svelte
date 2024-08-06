<script lang="ts">
    import { createEventDispatcher } from 'svelte'

    type View = 'default' | 'settings' | 'graph'

    export let view: View
    const dispatch = createEventDispatcher()

    function updateView(e: MouseEvent) {
        e.preventDefault()
        e.stopPropagation()
        const target = e.currentTarget as HTMLButtonElement
        const { name } = target
        dispatch('view', { newView: name })
    }

    $: isDefault = view == 'default'
</script>

<nav class="flex justify-end px-4">
    <ul class="flex justify-between gap-x-1 p-1 pr-0">
        <li class="w-5 h-5">
            <button name="default" on:click={updateView} class="w-5 h-5">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                    <path class="{isDefault ? 'fill-cyan-800' : 'fill-gray-400'}" d="M5.68 8.933Q6.938 8.219 8.3 7.86q1.363-.36 2.788-.36q.73 0 1.458.09t1.434.29q1.327.37 2.018.495q.692.125 1.5.125h.886l.483-4.5H5.116zM7.476 21q-.64 0-1.097-.404t-.513-1.025L4.14 4.283q-.067-.52.29-.901T5.309 3h13.384q.52 0 .877.382t.29.9l-1.705 15.29q-.056.62-.513 1.024q-.456.404-1.097.404z" />
                </svg>
            </button>
        </li>
        <li class="w-5 h-5">
            <button name="settings" on:click={updateView} class="w-5 h-5">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                    <path class="{isDefault ? 'fill-gray-400' : 'fill-cyan-800'}" d="m10.135 21l-.362-2.892q-.479-.145-1.035-.454q-.557-.31-.947-.664l-2.668 1.135l-1.865-3.25l2.306-1.739q-.045-.27-.073-.558q-.03-.288-.03-.559q0-.252.03-.53q.028-.278.073-.626L3.258 9.126l1.865-3.212L7.771 7.03q.448-.373.97-.673q.52-.3 1.013-.464L10.134 3h3.732l.361 2.912q.575.202 1.016.463t.909.654l2.725-1.115l1.865 3.211l-2.382 1.796q.082.31.092.569t.01.51q0 .233-.02.491q-.019.259-.088.626l2.344 1.758l-1.865 3.25l-2.681-1.154q-.467.393-.94.673t-.985.445L13.866 21zm1.838-6.5q1.046 0 1.773-.727T14.473 12t-.727-1.773t-1.773-.727q-1.052 0-1.776.727T9.473 12t.724 1.773t1.776.727" />
                </svg>
            </button>
        </li>

        <li class="w-5 h-5">
            <button name="graph" on:click={updateView} class="w-5 h-5">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                    <path class="{isDefault ? 'fill-gray-400' : 'fill-cyan-800'}" d="m10.135 21l-.362-2.892q-.479-.145-1.035-.454q-.557-.31-.947-.664l-2.668 1.135l-1.865-3.25l2.306-1.739q-.045-.27-.073-.558q-.03-.288-.03-.559q0-.252.03-.53q.028-.278.073-.626L3.258 9.126l1.865-3.212L7.771 7.03q.448-.373.97-.673q.52-.3 1.013-.464L10.134 3h3.732l.361 2.912q.575.202 1.016.463t.909.654l2.725-1.115l1.865 3.211l-2.382 1.796q.082.31.092.569t.01.51q0 .233-.02.491q-.019.259-.088.626l2.344 1.758l-1.865 3.25l-2.681-1.154q-.467.393-.94.673t-.985.445L13.866 21zm1.838-6.5q1.046 0 1.773-.727T14.473 12t-.727-1.773t-1.773-.727q-1.052 0-1.776.727T9.473 12t.724 1.773t1.776.727" />
                </svg>
            </button>
        </li>
    </ul>
</nav>
