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
exports.setModPath = exports.getModName = void 0;
var fs = __importStar(require("fs-extra"));
var path = __importStar(require("path"));
var packageJson = require("../package.json");
function getModName() {
    return packageJson.name;
}
exports.getModName = getModName;
function setModPath(sourcePath) {
    if (packageJson.scripts) {
        if (packageJson.scripts.dev) {
            var devScript = packageJson.scripts.dev;
            var newScript = devScript;
            var match = devScript.match(/tstl\s+--project\s+(.*?)\s+--watch/);
            if (match) {
                var newPath = path.join(sourcePath, "tsconfig.json");
                newScript = "tstl --project ".concat(newPath, " --watch");
            }
            packageJson.scripts.dev = newScript;
            fs.writeFileSync(path.resolve(__dirname, "..", "package.json"), JSON.stringify(packageJson, undefined, 4));
        }
    }
}
exports.setModPath = setModPath;
