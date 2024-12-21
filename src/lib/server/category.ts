import { and, asc, count, desc, eq, like, SQL } from 'drizzle-orm';
import { db } from './db';
import type { SQLiteColumn } from 'drizzle-orm/sqlite-core';
import { categories } from './db.schema';
import { z } from 'zod';
import { createInsertSchema } from 'drizzle-zod';

export async function getTotalRecords(userId: number, search?: string | null) {
	const countResult = await db
		.select({ count: count(categories.id) })
		.from(categories)
		.where(
			and(
				eq(categories.userId, userId),
				search && search.length ? like(categories.name, `%${search}%`) : undefined
			)
		);

	return countResult[0].count;
}

export function getSortOrder(field?: string) {
	const orders: (SQLiteColumn | SQL)[] = [];

	switch (field) {
		case '-name':
			orders.push(desc(categories.name));
			break;
		case 'name':
			orders.push(asc(categories.name));
		default:
			break;
	}
	return orders;
}

export function getPageCategory(
	userId: number,
	sortOrders: (SQLiteColumn | SQL)[],
	page: number,
	pageSize: number,
	search?: string | null
) {
	return db
		.select({
			id: categories.id,
			name: categories.name
		})
		.from(categories)
		.where(
			and(
				eq(categories.userId, userId),
				search && search.length ? like(categories.name, `%${search}%`) : undefined
			)
		)
		.orderBy(...sortOrders)
		.offset(page * pageSize - pageSize)
		.limit(pageSize);
}

export const updateCategoryValidator = createInsertSchema(categories, {
	id: z.coerce
		.number({ required_error: 'id is required' })
		.min(1, { message: 'id must be greater than 0' }),
	name: z.string({ required_error: 'name is required' }).min(1, { message: 'name cannot be empty' })
});

export const createCategoryValidator = createInsertSchema(categories, {
	name: z
		.string({ required_error: 'Name is required' })
		.trim()
		.min(1, { message: 'Name can not be empty' })
});

export const deleteCategoryValidator = z.number().array();
