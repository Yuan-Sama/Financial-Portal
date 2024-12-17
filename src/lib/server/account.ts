import { and, asc, count, desc, eq, like, SQL } from 'drizzle-orm';
import { Paginator, searchParamsValidator } from '.';
import { accounts } from './account.schema';
import { db } from './db';
import type { User } from './user.schema';
import type { SQLiteColumn } from 'drizzle-orm/sqlite-core';

export async function getPagingAccount(url: URL, user: User) {
	const validatedSearchParams = searchParamsValidator.safeParse(
		Object.fromEntries(url.searchParams)
	);

	const { p: page, pz: pageSize, s: search, o: order } = validatedSearchParams.data!;

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

	const orders = [] as (SQLiteColumn | SQL)[];

	switch (order) {
		case '-name':
			orders.push(desc(accounts.name));
			break;
		case 'name':
			orders.push(asc(accounts.name));
		default:
			break;
	}

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
		.orderBy(...orders)
		.offset(page * pageSize - pageSize)
		.limit(pageSize);

	const paginator = new Paginator(page, pageSize, totalRecords);

	return {
		pagination: paginator.toObject(),
		data
	};
}
