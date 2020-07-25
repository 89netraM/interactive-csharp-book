import * as fs from "fs-extra";

export type FileIndicator = string;

export interface Config {
	template: string;
	documents: Array<FileIndicator>;
	outDir: string;
}

export function loadConfig(): Config;
export function loadConfig(configPath: string): Config;
export function loadConfig(configPath?: string): Config {
	if (configPath == null) {
		if (fs.existsSync("book.config.json")) {
			configPath = "book.config.json";
		}
		else {
			console.error("Please provide a config file.");
			process.exit(1);
		}
	}

	return fs.readJSONSync(configPath);
}