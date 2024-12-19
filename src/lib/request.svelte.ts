export class RequestSearchParams {
	page: number = $state(1);
	pageSize: number = $state(5);
	search: string | null | undefined = $state();
	sort: string | undefined | null = $state();

	constructor(page = 1, pageSize = 5) {
		this.page = page;
		this.pageSize = pageSize;
	}

	toString() {
		return this.toURLSearchParams().toString();
	}

	toURLSearchParams() {
		const urlSearchParams = new URLSearchParams();

		if (this.page) urlSearchParams.append('p', this.page.toString());
		if (this.pageSize) urlSearchParams.append('pz', this.pageSize.toString());
		if (this.search && this.search.length) urlSearchParams.append('s', this.search);
		if (this.sort) urlSearchParams.set('o', this.sort);

		return urlSearchParams;
	}
}
