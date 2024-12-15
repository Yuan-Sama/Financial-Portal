import { AppName } from '$lib';
import { AccessTokenName, Authentication, secret } from '$lib/server/auth';
import { db } from '$lib/server/db';
import { users } from '$lib/server/user.schema';
import type { Handle } from '@sveltejs/kit';
import { eq } from 'drizzle-orm';
import * as jose from 'jose';

export const handle: Handle = async ({ event, resolve }) => {
	event.locals.Passport = new Authentication(async () => {
		const accessToken = event.cookies.get(AccessTokenName);
		if (!accessToken) return null;

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
			return null;
		}
	});

	return resolve(event);
};
