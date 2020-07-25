import * as fs from "fs";
import * as path from "path";
import { markdownsToHTMLFiles } from "./markdownProcessing";
import { findMarkdownsIn } from "./finder";
import { moveFilesTo } from "./file-mover";

if (process.argv.length < 3) {
	console.error("Must provide a folder as the first argument.");
	process.exit(1);
}
const markdownFiles = findMarkdownsIn(process.argv[2]);

if (process.argv.length < 4) {
	console.error("Must provide a html file as the second argument.");
	process.exit(1);
}
const htmlTemplate = fs.readFileSync(process.argv[3], "utf8");

const htmlOutputs = markdownsToHTMLFiles(markdownFiles, htmlTemplate);

if (process.argv.length >= 5) {
	const folder = process.argv[4];
	fs.mkdirSync(folder, { recursive: true });
	htmlOutputs.forEach(x => fs.writeFileSync(
		path.join(folder, x[0]),
		x[1],
		"utf8"
	));

	moveFilesTo(folder);
}
else {
	htmlOutputs.forEach(x => console.log(x[1]));
}