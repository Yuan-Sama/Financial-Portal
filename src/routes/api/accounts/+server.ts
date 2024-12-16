import type { RequestHandler } from './$types';
import { getPagingAccount } from '$lib/server/account';

export const GET: RequestHandler = async ({ url, locals }) => {
	const user = await locals.Passport.getUser();

	if (!user)
		return Response.json(
			{ message: 'Unauthorized' },
			{
				status: 401
			}
		);

	const pagingAccount = await getPagingAccount(url, user);

	return Response.json({
		pagination: pagingAccount.pagination,
		data: pagingAccount.data
	});
};
