<script>
    import { onDestroy, setContext } from "svelte";
	import { writable } from 'svelte/store';

	const selectedRow = writable(null);
	const selectedItem = writable(null);
	const selected = writable(null);

    const rows = [];

    setContext('s-rows', {
        registerRow(row) {
            rows.push(row);

			onDestroy(() => {
				const i = rows.indexOf(row);
				rows.splice(i, 1);
			});
        },
        selectedRow,
        selectedItem,
        selected
    });

    export let active = true;

    /**
     * @param {KeyboardEvent} e
     */
    function onKeydown(e) {
        if (!active)
            return;
        e.preventDefault();
        
        switch (e.keyCode) {
        case 37: // LEFT arrow
            console.log('left');
            if ($selectedRow) {
                const items = $selectedRow.items;
                if (!$selectedItem) {
                    $selectedItem = items[0];
                } else {
                    const index = items.indexOf($selectedItem);
                    $selectedItem = items[Math.max(0, index - 1)];
                }
            }
            break;
        case 38: // UP arrow
            console.log('up');
            if (!$selectedRow) {
                $selectedRow = rows[rows.length - 1];
            } else {
                const index = rows.indexOf($selectedRow);
                $selectedRow = rows[Math.max(0, index - 1)];
            }
            $selectedItem = $selectedRow.items[0];
            break;
        case 39: // RIGHT arrow
            console.log('right');
            if ($selectedRow) {
                const items = $selectedRow.items;
                if (!$selectedItem) {
                    $selectedItem = items[items.length - 1];
                } else {
                    const index = items.indexOf($selectedItem);
                    $selectedItem = items[Math.min(index + 1, items.length - 1)];
                }
            }
            break;
        case 40: // DOWN arrow
            console.log('down');
            if (!$selectedRow) {
                $selectedRow = rows[0];
            } else {
                const index = rows.indexOf($selectedRow);
                $selectedRow = rows[Math.min(index + 1, rows.length - 1)];
            }
            $selectedItem = $selectedRow.items[0];
            break;
        case 13: // OK button / Enter
            console.log('ok');
            $selected = {};
            break;
        case 8: // backspace button
        case 10009: // RETURN button
            // tizen.application.getCurrentApplication().exit();
            break;
        default:
            console.log('Key code : ' + e.keyCode);
            break;
        }
    }

  document.addEventListener('keydown', onKeydown);
  onDestroy(() => {
    document.removeEventListener('keydown', onKeydown);
  });

</script>

<div class="s-rows">
    <slot></slot>
</div>