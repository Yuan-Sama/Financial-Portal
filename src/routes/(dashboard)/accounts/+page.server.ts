import { accounts, insertAccountSchema } from '$lib/server/account.schema';
import { db } from '$lib/server/db';
import { fail } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { dev } from '$app/environment';
import { and, count, eq, inArray, like } from 'drizzle-orm';
import { z } from 'zod';

const PAGE_SIZE_DEFAULT = 5;
const PAGE_INDEX = 0;

export const load = (async ({ parent }) => {
	const { user } = await parent();

	const result = await db
		.select({ count: count(accounts.id) })
		.from(accounts)
		.where(eq(accounts.userId, user.id));

	const totalRecords = result[0].count;

	const data = await db
		.select({
			id: accounts.id,
			name: accounts.name
		})
		.from(accounts)
		.where(eq(accounts.userId, user.id))
		.offset(PAGE_INDEX)
		.limit(PAGE_SIZE_DEFAULT);

	const currentPage = !data.length ? 0 : PAGE_INDEX + 1;
	const totalPages = Math.ceil(totalRecords / PAGE_SIZE_DEFAULT);
	const nextPage = currentPage >= totalPages ? null : currentPage + 1;

	return {
		pagination: {
			prevPage: null,
			currentPage,
			nextPage,
			totalPages,
			totalRecords
		},
		data
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

	edit: async ({ request, locals }) => {
		const user = await locals.getUser();
		if (!user) return fail(401, { error: 'Unauthorized' });

		const formData = await request.formData();
		const rawData = Object.fromEntries(formData);

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

		await db
			.update(accounts)
			.set({
				name: result.data.name
			})
			.where(and(eq(accounts.userId, user.id), eq(accounts.id, result.data.id!)));

		return {
			updatedAccount: {
				id: result.data.id,
				name: result.data.name
			}
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
		const rawData = Object.fromEntries(formData) as { id: string };

		const result = z.coerce.number().safeParse(rawData.id);

		// if (dev) await new Promise((fullfill) => setTimeout(fullfill, 2000));

		if (result.error) {
			return fail(400, {
				error: result.error.errors[0].message
			});
		}

		const data = await db
			.delete(accounts)
			.where(and(eq(accounts.userId, user.id), eq(accounts.id, result.data)))
			.returning({
				id: accounts.id
			});

		return {
			deletedAccounts: data.map((a) => a.id)
		};
	},

	deleteBulk: async ({ request, locals }) => {
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
