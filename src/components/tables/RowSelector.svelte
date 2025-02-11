<script lang="ts" generics="TData">
	import { Input, Label } from '../forms';

	let {
		key,
		selectedRows = $bindable(),
		data,
		screenReader = undefined
	}: {
		key: string | number;
		selectedRows: { [id: string | number]: TData };
		data: TData;
		screenReader?: string | null;
	} = $props();
</script>

<td class="w-5 p-5">
	<Input
		id={'' + key}
		type="checkbox"
		checked={Boolean(selectedRows[key])}
		class="size-4 cursor-pointer"
		aria-label={screenReader}
		onchange={(e) => {
			if (e.currentTarget.checked) {
				selectedRows[key] = data;
			} else if (!e.currentTarget.checked && selectedRows[key]) {
				delete selectedRows[key];
			}
		}}
	/>
	<Label for={'' + key} class="sr-only">{screenReader}</Label>
</td>
