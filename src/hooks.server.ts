import { AppName } from '$lib';
import { AccessTokenName, secret } from '$lib/server/auth';
import { db } from '$lib/server/db';
import { users } from '$lib/server/user';
import type { Handle } from '@sveltejs/kit';
import { eq } from 'drizzle-orm';
import * as jose from 'jose';

export const handle: Handle = async ({ event, resolve }) => {
	event.locals.getUser = async () => {
		const accessToken = event.cookies.get(AccessTokenName);
		if (!accessToken) return;

		try {
			const claims = await jose.jwtVerify(accessToken, secret, {
				issuer: AppName,
				audience: AppName
			});
			const userId = claims.payload.id as number;

			const user = (await db.select().from(users).where(eq(users.id, userId)).limit(1))[0];
			return user;
		} catch (err) {
			console.error(err);
			return;
		}
	};
	return resolve(event);
};
