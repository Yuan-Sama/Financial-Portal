import { redirect } from '@sveltejs/kit';
import type { LayoutServerLoad } from './$types';

export const load = (async ({ locals, url }) => {
	const user = (await locals.auth.getUser()) as
		| {
				id: number;
				username: string;
				password: string;
		  }
		| undefined;

	url.searchParams.append('returnTo', encodeURIComponent(url.href));
	if (!user) redirect(307, `/sign-in?${url.searchParams}`);

	return {};
}) satisfies LayoutServerLoad;
