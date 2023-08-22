<script>
    import { getContext, createEventDispatcher } from "svelte";

	const dispatch = createEventDispatcher();

    const item = {};

    const { registerItem, selectedItem, selected } = getContext('s-row');

    registerItem(item);

    function dispatchOk() {
        if($selectedItem === item) {
            dispatch('ok', { item });
        }
    }

    $: {
        if($selected && $selectedItem === item) {
            dispatchOk();
        }
    }
</script>

<div class="s-item" class:selected={$selectedItem === item}>
    <slot selected={$selectedItem === item}></slot>
</div>

<style>
    .selected {
        border: 1px solid black;
    }
</style>