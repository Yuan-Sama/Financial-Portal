import { CookiesAccessTokenName } from '$lib/server';
import { Authentication, verifyAccessToken } from '$lib/server/auth';
import { getUserById } from '$lib/server/user';
import type { Handle } from '@sveltejs/kit';

export const handle: Handle = async ({ event, resolve }) => {
	event.locals.Passport = new Authentication(async () => {
		const token = event.cookies.get(CookiesAccessTokenName);
		if (!token) return undefined;

		const claims = await verifyAccessToken(token);
		if (!claims) return;

		const userId = claims.payload.id as number;
		return getUserById(userId);
	});

	return resolve(event);
};
