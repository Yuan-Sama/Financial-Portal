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
		const urlSearchParams = new URLSearchParams();

		if (this.page) urlSearchParams.append('p', this.page.toString());
		if (this.pageSize) urlSearchParams.append('pz', this.pageSize.toString());
		if (this.search && this.search.length) urlSearchParams.append('s', this.search);

		return urlSearchParams.toString();
	}
}
