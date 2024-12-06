import { redirect } from '@sveltejs/kit';
import type { LayoutServerLoad } from './$types';

export const load = (async ({ locals }) => {
	const user = await locals.getUser();

	if (!user) redirect(307, `/welcome`);

	return {
		user
	};
}) satisfies LayoutServerLoad;
