import * as marked from "marked";
import { insertIntoTemplate, Nav, NavItem } from "./html-template";
import * as fs from "fs";
import * as path from "path";

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

export function markdownToHTMLFile(markdown: string, nav: Nav, htmlTemplate: string): string {
	const markdownHTML = convertMarkdown(markdown);
	return insertIntoTemplate(markdownHTML, nav, htmlTemplate);
}

export function markdownsToHTMLFiles(markdownFiles: Array<string>, htmlTemplate: string): Array<[string, string]> {
	const htmlOutputs = new Array<[string, string]>();

	let previousNav: Nav & { file: string };
	for (let i = 0; i < markdownFiles.length; i++) {
		let previous: NavItem = null;
		if (previousNav != null) {
			const previousName = path.basename(previousNav.file, path.extname(previousNav.file));
			previous = {
				name: previousName,
				href: previousName + ".html"
			};

			const currentName = path.basename(markdownFiles[i], path.extname(markdownFiles[i]));
			previousNav.next = {
				name: currentName,
				href: currentName + ".html"
			};

			htmlOutputs.push([
				path.basename(previousNav.file, path.extname(previousNav.file)),
				markdownToHTMLFile(fs.readFileSync(previousNav.file, "utf8"), previousNav, htmlTemplate)
			]);
		}
		previousNav = {
			previous,
			file: markdownFiles[i]
		};
	}
	if (previousNav != null) {
		htmlOutputs.push([
			path.basename(previousNav.file, path.extname(previousNav.file)),
			markdownToHTMLFile(fs.readFileSync(previousNav.file, "utf8"), previousNav, htmlTemplate)
		]);
	}

	return htmlOutputs;
}