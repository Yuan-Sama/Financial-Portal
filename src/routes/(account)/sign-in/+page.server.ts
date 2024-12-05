import { db } from '$lib/server/db';
import { userSignInValidator, users } from '$lib/server/user';
import { eq } from 'drizzle-orm';
import type { Actions, PageServerLoad } from './$types';
import bcrypt from 'bcrypt';
import { redirect } from '@sveltejs/kit';
import type Joi from 'joi';
import * as jose from 'jose';
import { AppName } from '$lib';
import { AccessTokenName, secret } from '$lib/server/auth';

export const load = (async ({ locals }) => {
	const user = await locals.auth.getUser();
	if (user) redirect(303, '/');

	return {};
}) satisfies PageServerLoad;

export const actions: Actions = {
	default: async ({ request, cookies, url }) => {
		const signInRequest = Object.fromEntries(await request.formData());
		const { error: err, value: userSignIn } = <
			{ error: Joi.ValidationError | undefined; value: { email: string; password: string } }
		>userSignInValidator.validate(signInRequest);

		if (err) return { error: 'Email or password incorrect' };

		const user = (
			await db.select().from(users).where(eq(users.username, userSignIn.email)).limit(1)
		)[0];
		if (!user) return { error: 'Email or password incorrect' };

		const passwordsMatch = await bcrypt.compare(userSignIn.password, user.password);
		if (!passwordsMatch) return { error: 'Email or password incorrect' };

		const tempDate = new Date();
		const lifeTime = tempDate.setSeconds(tempDate.getSeconds() + 7200);

		const accessToken = await new jose.SignJWT({ id: user.id })
			.setProtectedHeader({ alg: 'HS256' })
			.setIssuedAt()
			.setIssuer(AppName)
			.setAudience(AppName)
			.setExpirationTime(Math.floor(lifeTime / 1000))
			.sign(secret);

		cookies.set(AccessTokenName, accessToken, {
			secure: true,
			path: '/',
			httpOnly: true,
			expires: new Date(lifeTime)
		});

		const returnTo = url.searchParams.get('returnTo');
		if (returnTo) redirect(303, decodeURIComponent(returnTo));

		redirect(303, '/');
	}
};
