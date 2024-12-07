import { accounts, insertAccountSchema } from '$lib/server/account';
import { db } from '$lib/server/db';
import { fail } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';

export const load = (async () => {
	return {};
}) satisfies PageServerLoad;

export const actions: Actions = {
	createAccount: async ({ request, locals }) => {
		const user = await locals.getUser();
		if (!user) return fail(401, { error: 'Unauthorized' });

		const formData = await request.formData();
		const rawData = Object.fromEntries(formData);

		const values = insertAccountSchema.pick({ name: true }).parse(rawData);

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
