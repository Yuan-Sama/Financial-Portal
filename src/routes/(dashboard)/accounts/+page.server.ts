import { db } from '$lib/server/db';
import { fail, redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { dev } from '$app/environment';
import { and, eq, inArray } from 'drizzle-orm';
import {
	createAccountValidator,
	deleteAccountValidator,
	editAccountValidator,
	getPagingAccount
} from '$lib/server/account';
import { accounts } from '$lib/server/db.schema';

export const load = (async ({ parent, url }) => {
	const user = (await parent()).user;

	const pagingAccount = await getPagingAccount(url, user);

	return {
		pagination: pagingAccount.pagination,
		data: pagingAccount.data
	};
}) satisfies PageServerLoad;

export const actions: Actions = {
	edit: async ({ url, request, locals }) => {
		const user = await locals.Passport.getUser();
		if (!user) redirect(303, `/sign-in?next=${encodeURI(url.href)}`);

		const formData = await request.formData();

		const result = editAccountValidator.safeParse(Object.fromEntries(formData));

		if (dev) await new Promise((fullfill) => setTimeout(fullfill, 2000));

		if (result.error) {
			console.log(result.error);

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

		const pagingAccount = await getPagingAccount(url, user);

		return {
			pagination: pagingAccount.pagination,
			data: pagingAccount.data
		};
	},

	create: async ({ url, request, locals }) => {
		const user = await locals.Passport.getUser();
		if (!user) redirect(303, `/sign-in?next=${encodeURI(url.href)}`);

		const formData = await request.formData();

		const result = createAccountValidator.safeParse(Object.fromEntries(formData));

		if (dev) await new Promise((fullfill) => setTimeout(fullfill, 2000));

		if (result.error) {
			console.log(result.error);

			return fail(400, {
				error: result.error.errors[0].message
			});
		}

		const { name } = result.data;

		await db.insert(accounts).values({
			userId: user.id,
			name: name
		});

		const pagingAccount = await getPagingAccount(url, user);

		return {
			pagination: pagingAccount.pagination,
			data: pagingAccount.data
		};
	},

	delete: async ({ url, request, locals }) => {
		const user = await locals.Passport.getUser();
		if (!user) redirect(303, `/sign-in?next=${encodeURI(url.href)}`);

		const formData = await request.formData();
		const obj = Object.fromEntries(formData) as { ids: string };

		const result = deleteAccountValidator.safeParse(JSON.parse(obj.ids).map(Number));

		// if (dev) await new Promise((fullfill) => setTimeout(fullfill, 2000));

		if (result.error) {
			console.log(result.error);

			return fail(400, {
				error: result.error.errors[0].message
			});
		}

		await db
			.delete(accounts)
			.where(and(eq(accounts.userId, user.id), inArray(accounts.id, result.data)));

		const pagingAccount = await getPagingAccount(url, user);

		return {
			pagination: pagingAccount.pagination,
			data: pagingAccount.data
		};
	}
};
