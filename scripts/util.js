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
exports.getUserPermission = exports.getCurrentVersion = exports.setModPath = exports.getModName = void 0;
const fs = __importStar(require("fs-extra"));
const path = __importStar(require("path"));
const readline = __importStar(require("readline"));
const packageJson = require("../package.json");
function getModName() {
    return packageJson.name;
}
exports.getModName = getModName;
function setModPath(sourcePath) {
    if (packageJson.scripts) {
        if (packageJson.scripts.dev) {
            const devScript = packageJson.scripts.dev;
            let newScript = devScript;
            let match = devScript.match(/tstl\s+--project\s+(.*?)\s+--watch/);
            if (match) {
                const newPath = path.join(sourcePath, "tsconfig.json");
                newScript = `tstl --project ${newPath} --watch`;
            }
            packageJson.scripts.dev = newScript;
            fs.writeFileSync(path.resolve(__dirname, "..", "package.json"), JSON.stringify(packageJson, undefined, 4));
        }
    }
}
exports.setModPath = setModPath;
function getCurrentVersion() {
    const modPath = path.resolve(__dirname, "..", "mod");
    const infoPath = path.join(modPath, "info.json");
    if (!fs.existsSync(infoPath)) {
        throw Error("'info.json' not found!");
    }
    const info = require(infoPath);
    return info.version;
}
exports.getCurrentVersion = getCurrentVersion;
const rlInterface = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});
function getUserPermission(msg) {
    return new Promise(resolve => {
        rlInterface.setPrompt(`${msg} [y/n] `);
        rlInterface.prompt();
        rlInterface.on("line", answer => {
            switch (answer.toLowerCase()) {
                case "y":
                    rlInterface.close();
                    resolve(true);
                    break;
                case "n":
                    rlInterface.close();
                    resolve(false);
                    break;
                default:
                    process.stdout.write(`${msg} [y/n] `); // Try again
            }
        });
    });
}
exports.getUserPermission = getUserPermission;
