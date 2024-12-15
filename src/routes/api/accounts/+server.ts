import { db } from '$lib/server/db';
import { and, count, eq } from 'drizzle-orm';
import type { RequestHandler } from './$types';
import { accounts } from '$lib/server/account.schema';
import { Paginator, searchParamsValidator } from '$lib/server';
import { like } from 'drizzle-orm';

export const GET: RequestHandler = async ({ url, locals }) => {
	const user = await locals.Passport.getUser();

	if (!user)
		return Response.json(
			{ message: 'Unauthorized' },
			{
				status: 401
			}
		);

	const validatedSearchParams = searchParamsValidator.safeParse(
		Object.fromEntries(url.searchParams)
	);

	const { p: page, pz: pageSize, s: search } = validatedSearchParams.data!;

	const result = await db
		.select({ count: count(accounts.id) })
		.from(accounts)
		.where(
			and(
				eq(accounts.userId, user.id),
				search && search.length ? like(accounts.name, `%${search}%`) : undefined
			)
		);

	const totalRecords = result[0].count;

	const data = await db
		.select({
			id: accounts.id,
			name: accounts.name
		})
		.from(accounts)
		.where(
			and(
				eq(accounts.userId, user.id),
				search && search.length ? like(accounts.name, `%${search}%`) : undefined
			)
		)
		.offset(page * pageSize - pageSize)
		.limit(pageSize);

	const paginator = new Paginator(page, pageSize, totalRecords);

	return Response.json({
		pagination: paginator.toObject(),
		data
	});
};
