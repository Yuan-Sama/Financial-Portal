export const AppName = 'Financial Portal';

export const DEFAULT_PAGE = 1;
export const DEFAULT_PAGE_SIZE = 5;
export const pageSizeOptions = [DEFAULT_PAGE_SIZE, 10, 15, 20, 25];

export class RequestSearchParams {
	page = $state(DEFAULT_PAGE);
	pageSize = $state(DEFAULT_PAGE_SIZE);
	/**
	 * @type {string | null | undefined}
	 */
	search = $state();

	constructor() {}

	toString() {
		return new URLSearchParams({
			page: this.page.toString(),
			pageSize: this.pageSize.toString()
		}).toString();
	}
}
