import { FileIndicator } from "./config-loader";
import * as glob from "glob";

export function findMarkdownsIn(documents: Array<FileIndicator>): Array<string> {
	return documents
		.map(g => glob.sync(g))
		.reduce((p, c) => p.concat(c), new Array<string>());
}