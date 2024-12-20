import { and, asc, count, desc, eq, like, SQL } from 'drizzle-orm';
import { db } from './db';
import type { SQLiteColumn } from 'drizzle-orm/sqlite-core';
import { accounts } from './db.schema';
import { z } from 'zod';

export async function getTotalRecords(userId: number, search?: string | null) {
	const countResult = await db
		.select({ count: count(accounts.id) })
		.from(accounts)
		.where(
			and(
				eq(accounts.userId, userId),
				search && search.length ? like(accounts.name, `%${search}%`) : undefined
			)
		);

	return countResult[0].count;
}

export function getSortOrder(field?: string) {
	const orders: (SQLiteColumn | SQL)[] = [];

	switch (field) {
		case '-name':
			orders.push(desc(accounts.name));
			break;
		case 'name':
			orders.push(asc(accounts.name));
		default:
			break;
	}
	return orders;
}

export function getPageAccount(
	userId: number,
	sortOrders: (SQLiteColumn | SQL)[],
	page: number,
	pageSize: number,
	search?: string | null
) {
	return db
		.select({
			id: accounts.id,
			name: accounts.name
		})
		.from(accounts)
		.where(
			and(
				eq(accounts.userId, userId),
				search && search.length ? like(accounts.name, `%${search}%`) : undefined
			)
		)
		.orderBy(...sortOrders)
		.offset(page * pageSize - pageSize)
		.limit(pageSize);
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
