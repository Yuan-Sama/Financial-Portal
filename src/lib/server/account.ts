import { and, count, eq, like } from 'drizzle-orm';
import { Paginator, searchParamsValidator } from '.';
import { accounts } from './account.schema';
import { db } from './db';
import type { User } from './user.schema';

export async function getPagingAccount(url: URL, user: User) {
	const validatedSearchParams = searchParamsValidator.safeParse(
		Object.fromEntries(url.searchParams)
	);

	const { p: page, pz: pageSize, s: search } = validatedSearchParams.data!;

	const countResult = await db
		.select({ count: count(accounts.id) })
		.from(accounts)
		.where(
			and(
				eq(accounts.userId, user.id),
				search && search.length ? like(accounts.name, `%${search}%`) : undefined
			)
		);

	const totalRecords = countResult[0].count;

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

	return {
		pagination: paginator.toObject(),
		data
	};
}
