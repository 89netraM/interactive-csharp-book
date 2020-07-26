import * as fs from "fs";
import * as path from "path";
import { markdownsToHTMLFiles } from "./markdownProcessing";
import { findMarkdownsIn } from "./finder";
import { moveFilesTo } from "./file-mover";
import { loadConfig } from "./config-loader";

const config = loadConfig(process.argv.length >= 3 ? process.argv[2] : null);

const markdownFiles = findMarkdownsIn(config.documents);
const htmlTemplate = fs.readFileSync(config.template, "utf8");

const htmlOutputs = markdownsToHTMLFiles(markdownFiles, htmlTemplate, config);

fs.mkdirSync(config.outDir, { recursive: true });
htmlOutputs.forEach((x, i) => fs.writeFileSync(
	path.join(config.outDir, i === 0 ? "index.html" : x[0]),
	x[1],
	"utf8"
));

moveFilesTo(config.outDir);