import { accounts, insertAccountSchema } from '$lib/server/account.schema';
import { db } from '$lib/server/db';
import { fail } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { dev } from '$app/environment';
import { and, eq, inArray, like } from 'drizzle-orm';
import { z } from 'zod';

export const load = (async ({ parent }) => {
	const data = await parent();

	const accs = await db
		.select({
			id: accounts.id,
			name: accounts.name
		})
		.from(accounts)
		.where(eq(accounts.userId, data.user.id));

	return {
		accounts: accs
	};
}) satisfies PageServerLoad;

export const actions: Actions = {
	search: async ({ request, locals }) => {
		const user = await locals.getUser();
		if (!user) return fail(401, { error: 'Unauthorized' });

		const formData = await request.formData();
		const rawData = Object.fromEntries(formData);

		const result = insertAccountSchema.pick({ name: true }).safeParse(rawData);

		if (dev) await new Promise((fullfill) => setTimeout(fullfill, 2000));

		if (result.error) {
			return fail(400, {
				error: result.error.errors[0].message
			});
		}

		console.log(`%${result.data.name}%`);

		const accs = await db
			.select({
				id: accounts.id,
				name: accounts.name
			})
			.from(accounts)
			.where(and(eq(accounts.userId, user.id), like(accounts.name, `%${result.data.name}%`)));

		return {
			accounts: accs
		};
	},
	create: async ({ request, locals }) => {
		const user = await locals.getUser();
		if (!user) return fail(401, { error: 'Unauthorized' });

		const formData = await request.formData();
		const rawData = Object.fromEntries(formData);

		const result = insertAccountSchema.pick({ name: true }).safeParse(rawData);

		if (dev) await new Promise((fullfill) => setTimeout(fullfill, 2000));

		if (result.error) {
			return fail(400, {
				error: result.error.errors[0].message
			});
		}

		const values = result.data;

		await db.insert(accounts).values({
			userId: user.id,
			...values
		});

		const accs = await db
			.select({
				id: accounts.id,
				name: accounts.name
			})
			.from(accounts)
			.where(eq(accounts.userId, user.id));

		return {
			accounts: accs
		};
	},

	delete: async ({ request, locals }) => {
		const user = await locals.getUser();
		if (!user) return fail(401, { error: 'Unauthorized' });

		const formData = await request.formData();
		const rawData = Object.fromEntries(formData) as { ids: string };

		const result = z.number().array().safeParse(JSON.parse(rawData.ids).map(Number));

		// if (dev) await new Promise((fullfill) => setTimeout(fullfill, 2000));

		if (result.error) {
			return fail(400, {
				error: result.error.errors[0].message
			});
		}

		const data = await db
			.delete(accounts)
			.where(and(eq(accounts.userId, user.id), inArray(accounts.id, result.data)))
			.returning({
				id: accounts.id
			});

		return {
			deletedAccounts: data.map((a) => a.id)
		};
	}
};
