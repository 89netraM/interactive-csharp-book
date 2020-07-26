import * as path from "path";

export function fileToName(fileName: string): string {
	if (fileName === "!toc!") {
		return "Table of Contents";
	}
	else {
		return path.basename(fileName, path.extname(fileName));
	}
}

export function fileToHTMLFile(fileName: string, index: number): string {
	if (index === 0) {
		return "index.html";
	}
	else if (fileName === "!toc!") {
		return "toc.html";
	}
	else {
		return `${fileToName(fileName).replace(/\W+/g, "-").toLowerCase()}.html`;
	}
}