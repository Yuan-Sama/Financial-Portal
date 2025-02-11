<script lang="ts" generics="TData">
	import { Input, Label } from '$components/forms';

	let {
		selectedRows = $bindable(),
		collection
	}: {
		selectedRows: { [id: string | number]: TData };
		collection: TData[];
	} = $props();
</script>

<th scope="col" class="w-5 p-5">
	<Input
		id="selectAll"
		type="checkbox"
		checked={collection.length > 0 && collection.length === Object.values(selectedRows).length}
		class="size-4 cursor-pointer"
		aria-label="Select All"
		onchange={(e) => {
			selectedRows = !e.currentTarget.checked
				? {}
				: collection.reduce((obj, data, idx) => Object.assign(obj, { [idx]: data }), {});
		}}
	/>
	<Label for="selectAll" class="sr-only">Select All</Label>
</th>
