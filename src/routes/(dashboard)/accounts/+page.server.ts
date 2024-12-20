import { db } from '$lib/server/db';
import { fail, redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { dev } from '$app/environment';
import { and, eq, inArray } from 'drizzle-orm';
import {
	createAccountValidator,
	deleteAccountValidator,
	editAccountValidator,
	getPageAccount,
	getSortOrder,
	getTotalRecords
} from '$lib/server/account';
import { accounts } from '$lib/server/db.schema';
import { delay, Paginator, redirectToSignInWith, searchParamsValidator } from '$lib/server';

const accountsPagePathname = '/accounts';

export const load = (async ({ parent }) => {
	const user = (await parent()).user;

	const page = 1;
	const pageSize = 5;
	const totalRecords = await getTotalRecords(user.id);

	const sortOrders = getSortOrder();
	const data = await getPageAccount(user.id, sortOrders, page, pageSize);

	const paginator = new Paginator(page, pageSize, totalRecords);

	return {
		pagination: paginator.toObject(),
		data
	};
}) satisfies PageServerLoad;

export const actions: Actions = {
	edit: async ({ url, request, locals }) => {
		const user = await locals.Passport.getUser();
		if (!user) redirect(303, redirectToSignInWith(url, accountsPagePathname));

		const formData = await request.formData();

		const result = editAccountValidator.safeParse(Object.fromEntries(formData));

		if (dev) {
			await delay(1, 2);
		}

		if (result.error) {
			return fail(400, {
				error: result.error.errors[0].message
			});
		}

		const { name: newName } = result.data;

		await db
			.update(accounts)
			.set({
				name: newName
			})
			.where(and(eq(accounts.userId, user.id), eq(accounts.id, result.data.id!)));

		const validatedSearchParams = searchParamsValidator.safeParse(
			Object.fromEntries(url.searchParams)
		);

		console.log(validatedSearchParams);

		if (validatedSearchParams.error) redirect(303, url.origin + accountsPagePathname);

		const { p: page, pz: pageSize, s: search, o: order } = validatedSearchParams.data;

		const totalRecords = await getTotalRecords(user.id);

		const sortOrders = getSortOrder(order);
		const data = await getPageAccount(user.id, sortOrders, page, pageSize, search);

		const paginator = new Paginator(page, pageSize, totalRecords);

		return {
			pagination: paginator.toObject(),
			data
		};
	},

	create: async ({ url, request, locals }) => {
		const user = await locals.Passport.getUser();
		if (!user) redirect(303, redirectToSignInWith(url, accountsPagePathname));

		const formData = await request.formData();

		const result = createAccountValidator.safeParse(Object.fromEntries(formData));

		if (dev) {
			await delay(1, 2);
		}

		if (result.error) {
			return fail(400, {
				error: result.error.errors[0].message
			});
		}

		const { name } = result.data;

		await db.insert(accounts).values({
			userId: user.id,
			name: name
		});

		const validatedSearchParams = searchParamsValidator.safeParse(
			Object.fromEntries(url.searchParams)
		);

		if (validatedSearchParams.error) redirect(303, url.origin + accountsPagePathname);

		const { p: page, pz: pageSize, s: search, o: order } = validatedSearchParams.data;

		const totalRecords = await getTotalRecords(user.id);

		const sortOrders = getSortOrder(order);
		const data = await getPageAccount(user.id, sortOrders, page, pageSize, search);

		const paginator = new Paginator(page, pageSize, totalRecords);

		return {
			pagination: paginator.toObject(),
			data
		};
	},

	delete: async ({ url, request, locals }) => {
		const user = await locals.Passport.getUser();
		if (!user) redirect(303, redirectToSignInWith(url, accountsPagePathname));

		const formData = await request.formData();
		const obj = Object.fromEntries(formData) as { ids: string };

		const result = deleteAccountValidator.safeParse(JSON.parse(obj.ids).map(Number));

		if (dev) {
			await delay(1, 2);
		}

		if (result.error) {
			return fail(400, {
				error: result.error.errors[0].message
			});
		}

		await db
			.delete(accounts)
			.where(and(eq(accounts.userId, user.id), inArray(accounts.id, result.data)));

		const validatedSearchParams = searchParamsValidator.safeParse(
			Object.fromEntries(url.searchParams)
		);

		if (validatedSearchParams.error) redirect(303, url.origin + accountsPagePathname);

		const { p: page, pz: pageSize, s: search, o: order } = validatedSearchParams.data!;

		const totalRecords = await getTotalRecords(user.id);

		const sortOrders = getSortOrder(order);
		const data = await getPageAccount(user.id, sortOrders, page, pageSize, search);

		const paginator = new Paginator(page, pageSize, totalRecords);

		return {
			pagination: paginator.toObject(),
			data
		};
	}
};
