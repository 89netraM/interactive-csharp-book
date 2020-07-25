import { fileToName } from "./file-to-name";

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
	file: string;
	next?: NavItem;
}

export function insertIntoTemplate(markdownHTML: string, nav: Nav, template: string): string {
	let html = template;

	html = html.replace(/<!-- CONTENT -->/g, markdownHTML);
	html = html.replace(/<!-- HEAD -->/g, headInjections);
	html = insertNavLinks(html, nav);
	html = html.replace(/<!-- PAGE-NAME -->/g, fileToName(nav.file));

	return html;
}

function insertNavLinks(html: string, nav: Nav): string {
	html = html.replace(/<!-- PREVIOUS -->/g, nav.previous ? `<a href="./${nav.previous.href}">${nav.previous.name}</a>` : "");
	html = html.replace(/<!-- NEXT -->/g, nav.next ? `<a href="./${nav.next.href}">${nav.next.name}</a>` : "");

	return html;
}