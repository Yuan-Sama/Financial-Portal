import { db } from '$lib/server/db';
import { count, eq } from 'drizzle-orm';
import type { RequestHandler } from './$types';
import { accounts } from '$lib/server/account.schema';
import { z } from 'zod';

export const GET: RequestHandler = async ({ url, locals }) => {
	const user = await locals.getUser();

	if (!user)
		return Response.json(
			{ error: 'Unauthorized' },
			{
				status: 401
			}
		);

	const body = Object.fromEntries(url.searchParams.entries());

	const result = z
		.object({
			page: z.coerce.number().min(1),
			pageSize: z.coerce.number().min(1).max(100)
		})
		.safeParse(body);

	if (result.error) {
		return Response.json(
			{
				errors: result.error.errors
			},
			{
				status: 400
			}
		);
	}

	const { page, pageSize } = result.data;

	const records = await db
		.select({ count: count(accounts.id) })
		.from(accounts)
		.where(eq(accounts.userId, user.id));

	const totalRecords = records[0].count;

	const data = await db
		.select({
			id: accounts.id,
			name: accounts.name
		})
		.from(accounts)
		.where(eq(accounts.userId, user.id))
		.offset(page * pageSize - pageSize)
		.limit(pageSize);

	const currentPage = page;
	const prevPage = currentPage - 1 < 1 ? null : currentPage - 1;
	const totalPages = Math.ceil(totalRecords / pageSize);
	const nextPage = currentPage >= totalPages ? null : currentPage + 1;

	return Response.json({
		pagination: {
			prevPage,
			currentPage,
			nextPage,
			totalPages,
			totalRecords
		},
		data
	});
};
