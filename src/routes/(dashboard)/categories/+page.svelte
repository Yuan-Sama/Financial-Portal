<script lang="ts">
	type Category = { id: number; name: string };
	type SelectedRows = { [id: number]: Category };

	import type { PageData } from './$types';
	import { RequestSearchParams } from '$lib/request.svelte';
	import { AppName } from '$lib';
	import { Input, Label } from '$components/forms';
	import { SideBarForm, Table, TableBottom, TableTop } from '$components/accounts';
	import { Button, Icon } from '$components';
	import { toastr } from '$components/toasts';
	import { SortableColumn } from '$components/tables';
	import DeleteButton from '$components/DeleteButton.svelte';

	let { data }: { data: PageData } = $props();

	const api = '/api/categories';
	const headings = [{ name: 'Name' }];
	const categorySearchParams = new RequestSearchParams();

	let showForm = $state(false);
	let categories = $state(data.data);
	let pagination = $state(data.pagination);
	let editCategory: Category | undefined | null = $state();
	let selectedRows: SelectedRows = $state({});

	let selectedRowsSize = $derived(Object.keys(selectedRows).length);

	function updateData(newData: { data: typeof categories; pagination: typeof pagination }) {
		categories = newData.data;
		pagination = newData.pagination;
	}

	function beforeSubmitForm() {
		const deletedCount = selectedRowsSize;
		const newTotalRecords = pagination.totalRecords - deletedCount;
		const newTotalPages = Math.ceil(newTotalRecords / categorySearchParams.pageSize);

		if (categorySearchParams.page > newTotalPages) categorySearchParams.page = newTotalPages;
	}
</script>

<svelte:head>
	<title>{AppName} - Categories</title>
</svelte:head>

<div class="mx-auto -mt-24 w-full max-w-screen-2xl pb-10">
	<div class="rounded-lg bg-white p-6 shadow-sm drop-shadow-sm dark:bg-gray-800">
		<div
			class="flex flex-col gap-y-2 space-y-1.5 p-6 lg:flex-row lg:items-center lg:justify-between"
		>
			<span class="line-clamp-1 text-xl font-semibold text-gray-900 dark:text-white">
				Transaction Categories
			</span>

			<Button
				class="flex items-center justify-center font-medium"
				size="sm"
				onclick={() => (showForm = true)}><Icon icon="plus" class="mr-2 size-4" />Add new</Button
			>
		</div>

		<div class="px-6 pb-6">
			<TableTop
				requestSearchParams={categorySearchParams}
				searchUrl={api}
				searchPlaceholder="Search for categories"
				updateDataAfterSearching={updateData}
				deleteButtonBeforeSubmitForm={beforeSubmitForm}
				deleteValue={Object.values(selectedRows).map((a) => a.id)}
				updateDataAfterDeleting={(newData) => {
					updateData(newData);
					selectedRows = {};
					toastr.success('Categories deleted');
				}}
				{selectedRowsSize}
			/>

			<Table collection={categories} {headings} bind:selectedRows>
				{#snippet head(heading)}
					<SortableColumn
						url={api}
						{heading}
						searchParams={categorySearchParams}
						success={updateData}
					/>
				{/snippet}
				{#snippet row(category, _)}
					<td class="px-5 py-3">{category.name}</td>
				{/snippet}
				{#snippet rowActions(category, _)}
					<button
						onclick={() => {
							editCategory = category;
							showForm = true;
						}}
						title="Edit"
					>
						<Icon icon="edit" class="font-medium text-blue-600 dark:text-blue-500" />
					</button>
					<DeleteButton
						iconOnly
						{beforeSubmitForm}
						searchParams={categorySearchParams}
						value={[category.id]}
						success={(newData) => {
							updateData(newData);
							selectedRows = {};
							toastr.success('Category deleted');
						}}
					/>
				{/snippet}
			</Table>

			<TableBottom
				{selectedRowsSize}
				searchParams={categorySearchParams}
				collection={categories}
				pageSizeSelectorUrl={api}
				pageSizeSelectorAfterSuccess={(newData) => {
					updateData(newData);
					selectedRows = {};
				}}
				bind:pagination
				paginationUrl={api}
				paginationAfterSuccess={(newData) => {
					updateData(newData);
					selectedRows = {};
				}}
			/>
		</div>
	</div>
</div>

<SideBarForm
	bind:show={showForm}
	bind:editData={editCategory}
	searchParams={categorySearchParams}
	createHeading="New Category"
	createSubHeading="Create a new category to organize your transactions."
	editHeading="Edit Category"
	editSubHeading="Edit an existing category."
	submitButtonCreateText="Create category"
	updateData={(newData) => {
		if (editCategory) {
			toastr.success('Category updated');
			editCategory = undefined;
		} else {
			toastr.success('Category created');
		}
		updateData(newData);
	}}
>
	{#snippet formContent(formState)}
		{#if editCategory}
			<input type="number" hidden name="id" value={editCategory.id} />
		{/if}

		<Label for="name">Name</Label>
		<Input
			class="mt-3 w-full"
			placeholder="e.g. Food, Travel, etc."
			value={editCategory?.name}
			id="name"
			name="name"
			bind:disabled={formState.submitting}
		/>
	{/snippet}
</SideBarForm>
