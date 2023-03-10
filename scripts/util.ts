import * as fs from 'fs-extra';
import * as path from 'path';

export interface ModInfo {
	name: string,
	version: string,
	title: string,
	author?: string,
	homepage?: string,
	dependencies?: string[],
	description?: string,
	factorio_version: string,
}

interface packageSnippet {
	name: string;
	scripts?: {
		dev?: string,
	};
}
const packageJson: packageSnippet = require("../package.json");

export function getModName(): string {
	return packageJson.name;
}

export function setModPath(sourcePath: string) {
	if (packageJson.scripts) {
		if (packageJson.scripts.dev) {
			const devScript = packageJson.scripts.dev;
			let newScript = devScript;
			let match = devScript.match(/tstl\s+--project\s+(.*?)\s+--watch/);
			if (match) {
				const newPath = path.join(sourcePath, "tsconfig.json");
				newScript = `tstl --project ${newPath} --watch`
			}
			packageJson.scripts.dev = newScript;
			fs.writeFileSync(path.resolve(__dirname, "..", "package.json"), JSON.stringify(packageJson, undefined, 4));
		}
	}
}