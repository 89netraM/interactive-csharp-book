export function insertIntoTemplate(markdownHTML: string, template: string): string {
	return template.replace("<!-- CONTENT -->", markdownHTML);
}