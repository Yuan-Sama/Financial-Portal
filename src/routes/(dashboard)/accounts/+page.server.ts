import { accounts, insertAccountSchema } from '$lib/server/account.schema';
import { db } from '$lib/server/db';
import { fail } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { dev } from '$app/environment';
import { eq } from 'drizzle-orm';

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
	}
};
