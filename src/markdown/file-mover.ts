import * as fs from "fs-extra";
import * as path from "path";

interface Moveable {
	from: string;
	to: string;
}
type Moveables = ReadonlyArray<Moveable>;

const things: Moveables = [
	{
		from: "./client",
		to: "./code-component"
	},
	{
		from: "../node_modules/browser-csharp/out/_framework",
		to: "./_framework"
	}
];

function copyTo(file: Moveable, dir: string): void {
	fs.copySync(
		path.resolve(__dirname, file.from),
		path.resolve(dir, file.to)
	);
}

export function moveFilesTo(dir: string): void {
	things.forEach(f => copyTo(f, dir));
}