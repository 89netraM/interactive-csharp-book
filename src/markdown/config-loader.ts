import * as fs from "fs-extra";
import * as path from "path";

export type FileIndicator = "!toc!" | string;

export interface Config {
	template: string;
	title: string;
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

	const loadedConfig: Config = fs.readJSONSync(configPath);
	const relativePath = path.relative("./", path.dirname(configPath));
	if (relativePath.length > 0) {
		loadedConfig.template = path.join(relativePath, loadedConfig.template);
		loadedConfig.documents = loadedConfig.documents
			.map(g => path.join(relativePath, g));
		loadedConfig.outDir = path.join(relativePath, loadedConfig.outDir);
	}
	return loadedConfig;
}