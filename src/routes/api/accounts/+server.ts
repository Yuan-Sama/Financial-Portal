import type { RequestHandler } from './$types';
import { db } from '$lib/server/db';
import { accounts, insertAccountSchema } from '$lib/server/account';
import { eq } from 'drizzle-orm';

export const GET: RequestHandler = async ({ locals }) => {
	const user = await locals.getUser();
	if (!user)
		return Response.json(
			{ message: 'Unauthorized' },
			{
				status: 401
			}
		);

	const data = await db
		.select({
			id: accounts.id,
			name: accounts.name
		})
		.from(accounts)
		.where(eq(accounts.userId, user.id));

	return Response.json(data);
};

export const POST: RequestHandler = async ({ locals, request }) => {
	const user = await locals.getUser();
	if (!user)
		return Response.json(
			{ message: 'Unauthorized' },
			{
				status: 401
			}
		);

	const requestValues = await request.json();
	const values = insertAccountSchema.pick({ name: true }).parse(requestValues);

	const data = (
		await db
			.insert(accounts)
			.values({
				userId: user.id,
				...values
			})
			.returning()
	).at(0);

	return Response.json(data);
};
