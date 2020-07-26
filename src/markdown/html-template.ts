import { fileToName } from "./file-to-name";
import { Config } from "./config-loader";

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
	index: number;
	next?: NavItem;
}

export function insertIntoTemplate(markdownHTML: string, nav: Nav, config: Config, template: string, hasTOC: boolean): string {
	let html = template;

	html = html.replace(/<!-- CONTENT -->/g, markdownHTML);
	html = html.replace(/<!-- HEAD -->/g, headInjections);
	html = insertNavLinks(html, nav, hasTOC);
	html = html.replace(/<!-- TITLE -->/g, config.title);
	html = html.replace(/<!-- PAGE-NAME -->/g, fileToName(nav.file));

	return html;
}

function insertNavLinks(html: string, nav: Nav, hasTOC: boolean): string {
	html = html.replace(/<!-- PREVIOUS -->/g, nav.previous ? `<a href="./${nav.previous.href}">${nav.previous.name}</a>` : "");
	html = html.replace(/<!-- NEXT -->/g, nav.next ? `<a href="./${nav.next.href}">${nav.next.name}</a>` : "");
	html = html.replace(/<!-- TOC-LINK -->/g, hasTOC ? `<a href="./toc.html">Table of Contents</a>` : "");

	return html;
}