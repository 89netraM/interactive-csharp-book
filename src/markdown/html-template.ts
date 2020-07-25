const headInjections = [
	`<script defer src="_framework/blazor.webassembly.js"></script>`,
	`<script defer src="code-component/main.js"></script>`
].join("");

export interface NavItem {
	name: string;
	href: string;
}
export interface Nav {
	previous?: NavItem;
	next?: NavItem;
}

export function insertIntoTemplate(markdownHTML: string, nav: Nav, template: string): string {
	let html = template;

	html = html.replace(/<!-- CONTENT -->/, markdownHTML);
	html = html.replace(/<!-- HEAD -->/, headInjections);
	html = insertNavLinks(html, nav);

	return html;
}

function insertNavLinks(html: string, nav: Nav): string {
	html = html.replace(/<!-- PREVIOUS -->/, nav.previous ? `<a href="./${nav.previous.href}">${nav.previous.name}</a>` : "");
	html = html.replace(/<!-- NEXT -->/, nav.next ? `<a href="./${nav.next.href}">${nav.next.name}</a>` : "");

	return html;
}