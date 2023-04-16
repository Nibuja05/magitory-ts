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
const modName = (0, util_1.getModName)();
const modPath = path.resolve(__dirname, "..", "mod");
if (!process.env.APPDATA) {
    console.log("Mod path not found!");
    process.exit();
}
const factorioPath = path.join(process.env.APPDATA, "Factorio/mods");
const tempPath = path.join(path.resolve(__dirname, ".."), "_temp");
let targetPath = "";
function CreateBackup() {
    fs.copySync(modPath, tempPath, { dereference: true });
}
function RemoveBackup() {
    if (!fs.existsSync(tempPath)) {
        return;
    }
    fs.rmSync(tempPath, { recursive: true });
}
function RestoreBackup() {
    if (!fs.existsSync(tempPath)) {
        return;
    }
    console.log("Restoring backup...");
    const newPath = path.join(path.resolve(__dirname, ".."), "mod");
    fs.renameSync(tempPath, newPath);
    // setModPath("mod");
    console.log(`Backup restored under: '${newPath}'`);
}
function CheckVersion() {
    const args = process.argv;
    if (args.length < 4) {
        console.log("Not enough parameters!");
        return;
    }
    const newVersion = args[3];
    const infoPath = path.join(modPath, "info.json");
    if (!fs.existsSync(infoPath)) {
        console.log("'info.json' not found!");
        return;
    }
    const info = require(infoPath);
    const oldVersion = info.version;
    if (oldVersion == newVersion) {
        console.log(`Version ${oldVersion} already exists!`);
        return;
    }
    info.version = newVersion;
    fs.writeFileSync(infoPath, JSON.stringify(info, undefined, 4));
    targetPath = path.join(factorioPath, modName + "_" + newVersion);
    fs.copySync(modPath, targetPath, { dereference: true });
    fs.rmSync(fs.realpathSync(modPath), { recursive: true });
    fs.unlinkSync(modPath);
    fs.symlinkSync(targetPath, modPath, "junction");
    return { newVersion, oldVersion };
}
function sleep(ms) {
    return new Promise(resolve => {
        setTimeout(resolve, ms);
    });
}
(async () => {
    console.log("\x1b[36m%s\x1b[0m", "PLEASE DO NOT INTERRUPT THE FOLLOWING PROCEDURE MANUALLY!");
    await sleep(3000);
    let versions = undefined;
    try {
        console.log("Creating backup before proceeding...");
        CreateBackup();
        versions = CheckVersion();
    }
    catch (exception) {
        console.log("\x1b[31m%s\x1b[0m", "Something went wrong while changing the version! See error log below:");
        console.log(exception);
        RestoreBackup();
    }
    finally {
        console.log("Removing backup and cleaning up...");
        try {
            RemoveBackup();
        }
        catch (exception2) {
            console.log("Error on backup removal!");
        }
    }
    if (versions) {
        console.log("\x1b[32m%s\x1b[0m", `\nVersion changed successfully from ${versions.oldVersion} ==> ${versions.newVersion}`);
    }
    else {
        console.log("\x1b[31m%s\x1b[0m", "\nVersion change was not successfull");
    }
})();
