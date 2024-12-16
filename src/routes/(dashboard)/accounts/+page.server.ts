import { accounts } from '$lib/server/account.schema';
import { db } from '$lib/server/db';
import { fail, redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { dev } from '$app/environment';
import { and, eq, inArray } from 'drizzle-orm';
import { z } from 'zod';
import { getPagingAccount } from '$lib/server/account';

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

		const rawData = Object.fromEntries(await request.formData());

		const result = z
			.object({
				id: z.coerce
					.number({ required_error: 'id is required' })
					.min(1, { message: 'id must be greater than 0' }),
				name: z
					.string({ required_error: 'name is required' })
					.min(1, { message: 'name cannot be empty' })
			})
			.safeParse(rawData);

		if (dev) await new Promise((fullfill) => setTimeout(fullfill, 2000));

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

		const pagingAccount = await getPagingAccount(url, user);

		return {
			pagination: pagingAccount.pagination,
			data: pagingAccount.data
		};
	},

	create: async ({ url, request, locals }) => {
		const user = await locals.Passport.getUser();
		if (!user) redirect(303, `/sign-in?next=${encodeURI(url.href)}`);

		const rawData = Object.fromEntries(await request.formData());

		const result = z
			.object({
				name: z
					.string({ required_error: 'Name is required' })
					.trim()
					.min(1, { message: 'Name can not be empty' })
			})
			.safeParse(rawData);

		if (dev) await new Promise((fullfill) => setTimeout(fullfill, 2000));

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
		const rawData = Object.fromEntries(formData) as { ids: string };

		const result = z.number().array().safeParse(JSON.parse(rawData.ids).map(Number));

		if (dev) await new Promise((fullfill) => setTimeout(fullfill, 2000));

		if (result.error) {
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
