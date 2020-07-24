import * as fs from "fs";
import * as path from "path";
import { convertMarkdown } from "./markdownProcessing";
import { insertIntoTemplate } from "./html-template";

if (process.argv.length < 3) {
	console.error("Must provide a markdown file as the first argument.");
	process.exit(1);
}
const markdownFile = process.argv[2];
const markdownHTML = convertMarkdown(fs.readFileSync(markdownFile, "utf8"));

if (process.argv.length < 4) {
	console.error("Must provide a html file as the second argument.");
	process.exit(1);
}
const htmlTemplate = process.argv[3];

const htmlOutput = insertIntoTemplate(markdownHTML, fs.readFileSync(htmlTemplate, "utf8"));

if (process.argv.length >= 5) {
	const htmlFile = process.argv[4];
	fs.mkdirSync(path.dirname(htmlFile), { recursive: true });
	fs.writeFileSync(htmlFile, htmlOutput, "utf8");
}
else {
	console.log(htmlOutput);
}