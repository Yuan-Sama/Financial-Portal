import type { Actions } from './$types';
import bcrypt from 'bcrypt';
import { fail, redirect } from '@sveltejs/kit';
import * as jose from 'jose';
import { AppName } from '$lib';
import { AccessTokenName, alg, lifeTimeInSeconds, secret } from '$lib/server/auth';
import { dev } from '$app/environment';
import { getUserByUsername } from '$lib/server/user';
import { signInSchema } from '$lib/server/user.schema';

async function signIn(username: string, password: string) {
	const user = await getUserByUsername(username);
	if (!user) return undefined;

	const passwordsMatch = await bcrypt.compare(password, user.password);
	if (!passwordsMatch) return undefined;

	return user;
}

export const actions: Actions = {
	default: async ({ request, cookies, url }) => {
		const formData = await request.formData();
		const rawData = Object.fromEntries(formData);

		const result = signInSchema.safeParse(rawData);

		if (dev)
			await new Promise((fullfill) => setTimeout(fullfill, Math.floor(Math.random() * 2001))); // Stimulate long request

		if (result.error) return fail(400, { error: 'Email or password incorrect' });

		const user = await signIn(result.data.username, result.data.password);
		if (!user) return fail(400, { error: 'Email or password incorrect' });

		const accessToken = await new jose.SignJWT({ id: user.id })
			.setProtectedHeader({ alg })
			.setIssuedAt()
			.setIssuer(AppName)
			.setAudience(AppName)
			.setExpirationTime(Math.floor(lifeTimeInSeconds / 1000))
			.sign(secret);

		cookies.delete(AccessTokenName, {
			path: '/'
		});

		cookies.set(AccessTokenName, accessToken, {
			secure: !dev,
			path: '/',
			httpOnly: !dev,
			expires: new Date(lifeTimeInSeconds)
		});

		const returnTo = url.searchParams.get('returnTo');
		if (returnTo) redirect(303, decodeURIComponent(returnTo));

		redirect(303, '/');
	}
};
