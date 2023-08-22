<script>
    import { getContext, onDestroy, setContext, createEventDispatcher } from "svelte";

	const dispatch = createEventDispatcher();

    const row = {
        items: []
    };

    const { registerRow, selectedRow, selectedItem, selected } = getContext('s-rows');
    setContext('s-row', {
        registerItem(item) {
            row.items.push(item);

			onDestroy(() => {
				const i = row.items.indexOf(item);
				row.items.splice(i, 1);
			});
        },
        selectedItem,
        selected
    });
    
    registerRow(row);

    function dispatchOk() {
        if($selectedRow === row) {
            dispatch('ok', { row });
        }
    }

    $: {
        if($selected) {
            dispatchOk();
        }
    }
</script>

<div class="s-row" class:selected="{$selectedRow === row}">
    <slot selected={$selectedRow === row}></slot>
</div>

<style>
    .selected {
        border: 1px solid black;
    }
</style>