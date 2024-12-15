import { accounts } from '$lib/server/account.schema';
import { db } from '$lib/server/db';
import { fail, redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { dev } from '$app/environment';
import { and, count, eq, inArray, like } from 'drizzle-orm';
import { z } from 'zod';
import { Paginator, searchParamsValidator } from '$lib/server';

export const load = (async ({ parent, url }) => {
	const user = (await parent()).user;

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

	return {
		pagination: paginator.toObject(),
		data
	};
}) satisfies PageServerLoad;

export const actions: Actions = {
	edit: async ({ url, request, locals }) => {
		const user = await locals.Passport.getUser();
		if (!user) redirect(303, `/sign-in?next=${encodeURI(url.href)}`);

		const rawData = Object.fromEntries(await request.formData());

		const result = z
			.object({
				id: z.coerce
					.number({ required_error: 'id is required' })
					.min(1, { message: 'id must be greater than 0' }),
				name: z
					.string({ required_error: 'name is required' })
					.min(1, { message: 'name cannot be empty' })
			})
			.safeParse(rawData);

		if (dev) await new Promise((fullfill) => setTimeout(fullfill, 2000));

		if (result.error) {
			return fail(400, {
				error: result.error.errors[0].message
			});
		}

		const { name: newName } = result.data;

		await db
			.update(accounts)
			.set({
				name: newName
			})
			.where(and(eq(accounts.userId, user.id), eq(accounts.id, result.data.id!)));

		return {
			updatedAccount: {
				id: result.data.id,
				name: result.data.name
			}
		};
	},

	create: async ({ url, request, locals }) => {
		const user = await locals.Passport.getUser();
		if (!user) redirect(303, `/sign-in?next=${encodeURI(url.href)}`);

		const rawData = Object.fromEntries(await request.formData());

		const result = z
			.object({
				name: z
					.string({ required_error: 'Name is required' })
					.trim()
					.min(1, { message: 'Name can not be empty' })
			})
			.safeParse(rawData);

		if (dev) await new Promise((fullfill) => setTimeout(fullfill, 2000));

		if (result.error) {
			return fail(400, {
				error: result.error.errors[0].message
			});
		}

		const { name } = result.data;

		await db.insert(accounts).values({
			userId: user.id,
			name: name
		});

		const accs = await db
			.select({
				id: accounts.id,
				name: accounts.name
			})
			.from(accounts)
			.where(eq(accounts.userId, user.id));

		return {
			accounts: accs
		};
	},

	delete: async ({ url, request, locals }) => {
		const user = await locals.Passport.getUser();
		if (!user) redirect(303, `/sign-in?next=${encodeURI(url.href)}`);

		const formData = await request.formData();
		const rawData = Object.fromEntries(formData) as { ids: string };

		const result = z.number().array().safeParse(JSON.parse(rawData.ids).map(Number));

		// if (dev) await new Promise((fullfill) => setTimeout(fullfill, 2000));

		if (result.error) {
			return fail(400, {
				error: result.error.errors[0].message
			});
		}

		const data = await db
			.delete(accounts)
			.where(and(eq(accounts.userId, user.id), inArray(accounts.id, result.data)))
			.returning({
				id: accounts.id
			});

		return {
			deletedAccounts: data.map((a) => a.id)
		};
	}
};
