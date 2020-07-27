import * as marked from "marked";
import { insertIntoTemplate, Nav, NavItem } from "./html-template";
import * as fs from "fs";
import { fileToName, fileToHTMLFile } from "./file-to-name";
import { Config } from "./config-loader";
import { MArray } from "./MArray";
import { escapeHtml } from "./html-escape";

const renderer: Partial<marked.Renderer> = {
	code: (src, language, isEscaped) => {
		return `<code-component language="${language}" size="16">${
				isEscaped ? src : escapeHtml(src)
			}</code-component>`;
	}
};

export function convertMarkdown(markdown: string): string {
	marked.use({ renderer: renderer as marked.Renderer });
	return marked(markdown);
}

export function markdownToHTMLFile(markdown: string, nav: Nav, config: Config, htmlTemplate: string, hasTOC: boolean): string {
	const markdownHTML = convertMarkdown(markdown);
	return insertIntoTemplate(markdownHTML, nav, config, htmlTemplate, hasTOC);
}

export function TOCToHTMLFile(navs: Array<Nav>, nav: Nav, config: Config, htmlTemplate: string): string {
	function navToLink(nav: Nav): string {
		return `<li><a href="${fileToHTMLFile(nav.file, nav.index)}">${fileToName(nav.file)}</a></li>`;
	}

	const html = `
		<h2>Table of Contents</h2>
		<ol>
			${navs.map(navToLink).join("")}
		</ol>
	`;
	return insertIntoTemplate(html, nav, config, htmlTemplate, false);
}

export function markdownsToHTMLFiles(markdownFiles: Array<string>, htmlTemplate: string, config: Config): Array<[string, string]> {
	const htmlOutputs = new Array<[string, string]>();

	const tocIndex = markdownFiles.indexOf("!toc!");

	const record = new MArray<Nav>();
	for (let i = 0; i < markdownFiles.length; i++) {
		let previous: NavItem = null;
		if (record.last != null) {
			previous = {
				name: fileToName(record.last.file),
				href: fileToHTMLFile(record.last.file, record.last.index)
			};

			record.last.next = {
				name: fileToName(markdownFiles[i]),
				href: fileToHTMLFile(markdownFiles[i], i)
			};

			if (record.last.file === "!toc!") {
				htmlOutputs.push(null);
			}
			else {
				htmlOutputs.push([
					fileToHTMLFile(record.last.file, record.last.index),
					markdownToHTMLFile(fs.readFileSync(record.last.file, "utf8"), record.last, config, htmlTemplate, tocIndex !== -1)
				]);
			}
		}
		record.push({
			previous,
			file: markdownFiles[i],
			index: i
		});
	}
	if (record.last != null) {
		htmlOutputs.push([
			fileToHTMLFile(record.last.file, record.last.index),
			markdownToHTMLFile(fs.readFileSync(record.last.file, "utf8"), record.last, config, htmlTemplate, tocIndex !== -1)
		]);
	}

	if (tocIndex !== -1) {
		htmlOutputs[tocIndex] = [
			fileToHTMLFile(record[tocIndex].file, tocIndex),
			TOCToHTMLFile(record, record[tocIndex], config, htmlTemplate)
		];
	}

	return htmlOutputs;
}