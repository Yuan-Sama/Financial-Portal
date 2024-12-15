export class RequestSearchParams {
	page = $state(1);
	pageSize = $state(5);
	search = $state('');

	constructor() {}

	toString() {
		return new URLSearchParams({
			page: this.page.toString(),
			pageSize: this.pageSize.toString()
		}).toString();
	}
}
