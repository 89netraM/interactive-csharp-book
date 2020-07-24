import * as fs from "fs";
import * as path from "path";
import { markdownToHTMLFile } from "./markdownProcessing";
import { findMarkdownsIn } from "./finder";

if (process.argv.length < 3) {
	console.error("Must provide a folder as the first argument.");
	process.exit(1);
}
const markdownFiles = findMarkdownsIn(process.argv[2]);

if (process.argv.length < 4) {
	console.error("Must provide a html file as the second argument.");
	process.exit(1);
}
const htmlTemplate = process.argv[3];

const htmlOutputs = markdownFiles.map(x => [
	path.basename(x, ".md"),
	markdownToHTMLFile(
		fs.readFileSync(x, "utf8"),
		fs.readFileSync(htmlTemplate, "utf8")
	)
]);

if (process.argv.length >= 5) {
	const folder = process.argv[4];
	fs.mkdirSync(folder, { recursive: true });
	htmlOutputs.forEach(x => fs.writeFileSync(
		path.join(folder, `${x[0]}.html`),
		x[1],
		"utf8"
	));
}
else {
	htmlOutputs.forEach(x => console.log(x[1]));
}