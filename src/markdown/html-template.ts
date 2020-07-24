const headInjections = [
	`<script src="_framework/blazor.webassembly.js"></script>`,
	`<script src="code-component.js"></script>`
].join("");

export function insertIntoTemplate(markdownHTML: string, template: string): string {
	let html = template;

	html = html.replace("<!-- CONTENT -->", markdownHTML);
	html = html.replace("<!-- HEAD -->", headInjections);

	return html;
}