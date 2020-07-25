import * as marked from "marked";
import { insertIntoTemplate, Nav, NavItem } from "./html-template";
import * as fs from "fs";
import * as path from "path";
import { fileToName, fileToHTMLFile } from "./file-to-name";
import { Config } from "./config-loader";

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

export function markdownToHTMLFile(markdown: string, nav: Nav, config: Config, htmlTemplate: string): string {
	const markdownHTML = convertMarkdown(markdown);
	return insertIntoTemplate(markdownHTML, nav, config, htmlTemplate);
}

export function markdownsToHTMLFiles(markdownFiles: Array<string>, htmlTemplate: string, config: Config): Array<[string, string]> {
	const htmlOutputs = new Array<[string, string]>();

	let previousNav: Nav;
	for (let i = 0; i < markdownFiles.length; i++) {
		let previous: NavItem = null;
		if (previousNav != null) {
			previous = {
				name: fileToName(previousNav.file),
				href: fileToHTMLFile(previousNav.file)
			};

			previousNav.next = {
				name: fileToName(markdownFiles[i]),
				href: fileToHTMLFile(markdownFiles[i])
			};

			htmlOutputs.push([
				fileToHTMLFile(previousNav.file),
				markdownToHTMLFile(fs.readFileSync(previousNav.file, "utf8"), previousNav, config, htmlTemplate)
			]);
		}
		previousNav = {
			previous,
			file: markdownFiles[i]
		};
	}
	if (previousNav != null) {
		htmlOutputs.push([
			fileToHTMLFile(previousNav.file),
			markdownToHTMLFile(fs.readFileSync(previousNav.file, "utf8"), previousNav, config, htmlTemplate)
		]);
	}

	return htmlOutputs;
}