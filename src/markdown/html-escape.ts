const replacers: Array<[RegExp, string]> = [
	[ /&/g, "&amp;" ],
	[ /</g, "&lt;" ],
	[ />/g, "&gt;" ],
	[ /"/g, "&quot;" ],
	[ /'/g, "&#039;" ]
];

export function escapeHtml(unsafe: string): string {
	return replacers.reduce((str, r) => str.replace(...r), unsafe);
}