"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
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
var fs = __importStar(require("fs-extra"));
var path = __importStar(require("path"));
var util_1 = require("./util");
var baseInfo = {
    name: "",
    version: "0.0.1",
    title: "",
    author: "",
    homepage: "",
    dependencies: [],
    description: "",
    factorio_version: "1.1",
};
function CreateSymlink() {
    if (!process.env.APPDATA) {
        console.log("Appdata/Roaming  directory not found.");
        return;
    }
    var factorioPath = path.join(process.env.APPDATA, "Factorio/mods");
    if (!fs.existsSync(factorioPath)) {
        console.log("Factorio mod directory not found.");
        return;
    }
    var modName = util_1.getModName();
    var sourcePath = path.resolve(__dirname, "..", modName);
    var modPath = path.join(factorioPath, modName + "_0.0.1");
    if (fs.existsSync(modPath)) {
        if (fs.existsSync(sourcePath)) {
            var isCorrect = fs.lstatSync(sourcePath).isSymbolicLink() && fs.realpathSync(sourcePath) === modPath;
            if (isCorrect) {
                console.log("mod is already correctly linked.");
            }
        }
        console.log("mod '" + modPath + "' already exists.");
        return;
    }
    var copyPath = path.resolve(__dirname, "..", "mod");
    if (!fs.existsSync(copyPath)) {
        console.log("'mod' path does not exist.");
        return;
    }
    baseInfo.name = modName;
    baseInfo.title = modName.charAt(0).toUpperCase() + modName.slice(1).replace("_", " ");
    fs.writeFileSync(path.join(copyPath, "info.json"), JSON.stringify(baseInfo, undefined, 4));
    fs.moveSync(copyPath, modPath);
    fs.symlinkSync(modPath, sourcePath, "junction");
    util_1.setModPath(modName);
    console.log("Linked " + sourcePath + " <==> " + modPath);
}
CreateSymlink();
