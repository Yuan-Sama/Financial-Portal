import { and, asc, count, desc, eq, like, SQL } from 'drizzle-orm';
import { Paginator, searchParamsValidator } from '.';
import { db } from './db';
import type { SQLiteColumn } from 'drizzle-orm/sqlite-core';
import { accounts, type User } from './db.schema';
import { z } from 'zod';

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

export const editAccountValidator = z.object({
	id: z.coerce
		.number({ required_error: 'id is required' })
		.min(1, { message: 'id must be greater than 0' }),
	name: z.string({ required_error: 'name is required' }).min(1, { message: 'name cannot be empty' })
});

export const createAccountValidator = z.object({
	name: z
		.string({ required_error: 'Name is required' })
		.trim()
		.min(1, { message: 'Name can not be empty' })
});

export const deleteAccountValidator = z.number().array();
