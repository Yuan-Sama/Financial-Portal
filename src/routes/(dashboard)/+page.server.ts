import { accounts, insertAccountSchema } from '$lib/server/account.schema';
import { db } from '$lib/server/db';
import { fail } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { dev } from '$app/environment';

export const load = (async () => {
	return {};
}) satisfies PageServerLoad;

export const actions: Actions = {
	createAccount: async ({ request, locals }) => {
		const user = await locals.getUser();
		if (!user) return fail(401, { error: 'Unauthorized' });

		const formData = await request.formData();
		const rawData = Object.fromEntries(formData);

		// TODO: validation here
		const result = insertAccountSchema.pick({ name: true }).safeParse(rawData);

		if (dev) await new Promise((fullfill) => setTimeout(fullfill, 2000));

		if (result.error) {
			return fail(400, {
				error: result.error.errors[0].message
			});
		}

		const values = result.data;

		const data = (
			await db
				.insert(accounts)
				.values({
					userId: user.id,
					...values
				})
				.returning({ id: accounts.id, name: accounts.name })
		).at(0);

		return data;
	}
};
