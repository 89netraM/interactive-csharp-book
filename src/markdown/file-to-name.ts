import * as path from "path";

export function fileToName(fileName: string): string {
	return path.basename(fileName, path.extname(fileName));
}

export function fileToHTMLFile(fileName: string): string {
	return `${fileToName(fileName).replace(/\W+/g, "-").toLowerCase()}.html`;
}