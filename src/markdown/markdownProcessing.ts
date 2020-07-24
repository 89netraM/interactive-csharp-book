import * as marked from "marked";
import { insertIntoTemplate } from "./html-template";

const renderer: Partial<marked.Renderer> = {
	code: (src, language, isEscaped) => {
		return `<code-component language="${language}" size="16">${
				src
			}</code-component>`;
	}
};

export function convertMarkdown(markdown: string): string {
	marked.use({ renderer: renderer as marked.Renderer });
	return marked(markdown);
}

export function markdownToHTMLFile(markdown: string, htmlTemplate: string): string {
	const markdownHTML = convertMarkdown(markdown);
	return insertIntoTemplate(markdownHTML, htmlTemplate);
}