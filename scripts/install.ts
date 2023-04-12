import * as fs from "fs-extra";
import * as path from "path";
import { ModInfo, getCurrentVersion, getModName, getUserPermission, setModPath } from "./util";

const baseInfo: ModInfo = {
	name: "",
	version: "0.0.1",
	title: "",
	author: "",
	homepage: "",
	dependencies: [],
	description: "",
	factorio_version: "1.1"
};

async function CreateSymlink() {
	if (!process.env.APPDATA) {
		console.log("Appdata/Roaming  directory not found.");
		return;
	}
	const factorioPath = path.join(process.env.APPDATA, "Factorio/mods");
	if (!fs.existsSync(factorioPath)) {
		console.log("Factorio mod directory not found.");
		return;
	}
	const modName = getModName();
	const sourcePath = path.resolve(__dirname, "..", "mod");
	const version = getCurrentVersion();
	const modPath = path.join(factorioPath, modName + "_" + version);
	if (fs.existsSync(modPath)) {
		if (!isSymlinkCorrect(modPath, sourcePath)) {
			console.log(`mod '${modPath}' already exists.`);
			const answer = await getUserPermission("Do you want to delete that directory and relink it?");
			if (answer) {
				console.log("Removing ", sourcePath);
				// fs.rmdirSync()
			} else {
				return;
			}
		} else {
			process.exit(0);
		}
	}
	const copyPath = path.resolve(__dirname, "..", "mod");
	if (!fs.existsSync(copyPath)) {
		console.log("'mod' path does not exist.");
		return;
	}
	baseInfo.name = modName;
	baseInfo.title = modName.charAt(0).toUpperCase() + modName.slice(1).replace("_", " ");
	fs.writeFileSync(path.join(copyPath, "info.json"), JSON.stringify(baseInfo, undefined, 4));
	fs.moveSync(copyPath, modPath);
	fs.symlinkSync(modPath, sourcePath, "junction");
	console.log(`Linked ${sourcePath} <==> ${modPath}`);
}

function isSymlinkCorrect(modPath: string, sourcePath: string) {
	if (fs.existsSync(sourcePath)) {
		const isCorrect = fs.lstatSync(sourcePath).isSymbolicLink() && fs.realpathSync(sourcePath) === modPath;
		if (isCorrect) {
			console.log("mod is already correctly linked.");
			return true;
		}
	}
	return false;
}

CreateSymlink();
