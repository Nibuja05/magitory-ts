"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs = __importStar(require("fs-extra"));
const path = __importStar(require("path"));
const util_1 = require("./util");
const baseInfo = {
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
        end(false, "Appdata/Roaming  directory not found");
    }
    const factorioPath = path.join(process.env.APPDATA, "Factorio/mods");
    if (!fs.existsSync(factorioPath)) {
        end(false, "Factorio mod directory not found");
    }
    const modName = (0, util_1.getModName)();
    const sourcePath = path.resolve(__dirname, "..", "mod");
    const version = (0, util_1.getCurrentVersion)();
    const modPath = path.join(factorioPath, modName + "_" + version);
    if (fs.existsSync(modPath)) {
        if (!isSymlinkCorrect(modPath, sourcePath)) {
            console.log(`mod '${modPath}' already exists.`);
            const answer = await (0, util_1.getUserPermission)("Do you want to delete that directory and relink it?");
            if (answer) {
                console.log("Removing ", modPath);
                fs.rmSync(modPath, {
                    recursive: true
                });
            }
            else {
                end(false, "Could not create and link directory, as it already exists");
            }
        }
        else {
            end();
        }
    }
    const copyPath = path.resolve(__dirname, "..", "mod");
    if (!fs.existsSync(copyPath)) {
        end(false, "'mod' path does not exist");
    }
    baseInfo.name = modName;
    baseInfo.title = modName.charAt(0).toUpperCase() + modName.slice(1).replace("_", " ");
    fs.writeFileSync(path.join(copyPath, "info.json"), JSON.stringify(baseInfo, undefined, 4));
    fs.moveSync(copyPath, modPath);
    fs.symlinkSync(modPath, sourcePath, "junction");
    console.log(`Linked ${sourcePath} <==> ${modPath}`);
    end();
}
function isSymlinkCorrect(modPath, sourcePath) {
    if (fs.existsSync(sourcePath)) {
        const isCorrect = fs.lstatSync(sourcePath).isSymbolicLink() && fs.realpathSync(sourcePath) === modPath;
        if (isCorrect) {
            console.log("mod is already correctly linked.");
            return true;
        }
    }
    return false;
}
function end(success = true, reason) {
    if (success)
        console.log("\x1b[32m%s\x1b[0m", `\nInstallation successfull!`);
    else {
        console.log("\x1b[31m%s\x1b[0m", `\nSomething went wrong...`);
        if (reason)
            console.log(reason);
    }
    process.exit(0);
}
CreateSymlink();
