import * as fs from "fs";
import * as marked from "marked";
import * as path from "path";

if (process.argv.length < 3) {
	console.error("Must provide a markdown file as the first argument.");
	process.exit(1);
}
const markdownFile = process.argv[2];

const htmlOutput = marked(fs.readFileSync(markdownFile, "utf8"));

if (process.argv.length >= 4) {
	const htmlFile = process.argv[3];
	fs.mkdirSync(path.dirname(htmlFile), { recursive: true });
	fs.writeFileSync(htmlFile, htmlOutput, "utf8");
}
else {
	console.log(htmlOutput);
}