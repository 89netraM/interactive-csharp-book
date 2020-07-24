import * as fs from "fs";
import * as path from "path";

export function findMarkdownsIn(dir: string): Array<string> {
	return fs.readdirSync(dir)
		.filter(x => /.md$/i.test(x))
		.map(x => path.join(dir, x));
}