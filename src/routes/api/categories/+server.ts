import { Paginator, redirectToSignInWith, searchParamsValidator } from '$lib/server';
import { getPageCategory, getSortOrder, getTotalRecords } from '$lib/server/category';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async ({ url, locals }) => {
	const user = await locals.Passport.getUser();

	if (!user)
		return Response.json(
			{ message: 'Unauthorized', location: redirectToSignInWith(url, '/categories') },
			{
				status: 401
			}
		);

	const validatedSearchParams = searchParamsValidator.safeParse(
		Object.fromEntries(url.searchParams)
	);

	if (validatedSearchParams.error)
		return Response.json(
			{
				location: url.origin + '/categories'
			},
			{
				status: 303
			}
		);

	const { p: page, pz: pageSize, s: search, o: order } = validatedSearchParams.data;

	const totalRecords = await getTotalRecords(user.id);

	const sortOrders = getSortOrder(order);
	const data = await getPageCategory(user.id, sortOrders, page, pageSize, search);

	const paginator = new Paginator(page, pageSize, totalRecords);

	return Response.json({
		pagination: paginator.toObject(),
		data
	});
};
