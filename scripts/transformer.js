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
const ts = __importStar(require("typescript"));
const fs = __importStar(require("fs-extra"));
const path = __importStar(require("path"));
function getEnumName(node, typeChecker) {
    const symbol = typeChecker.getSymbolAtLocation(node);
    if (!symbol)
        return;
    if (!symbol.declarations)
        return;
    const declaration = symbol.declarations[0];
    if (!ts.isEnumMember(declaration))
        return;
    return declaration.initializer?.getText();
}
function cleanText(text) {
    return text.slice(1, text.length - 1);
}
function isLocalizeFunction(name) {
    return name == "localizeName" || name == "localizeDescription" || name == "localize";
}
function getExpressionValue(expression, typeChecker) {
    if (ts.isPropertyAccessExpression(expression)) {
        const enumName = getEnumName(expression, typeChecker);
        if (enumName)
            return cleanText(enumName);
    }
    else if (ts.isStringLiteral(expression)) {
        return cleanText(expression.getText());
    }
    return "<undefined>";
}
const localizeOutput = (lang) => `mod/locale/${lang}/all.cfg`;
const fileMap = new Map();
const languageMap = new Map();
// const localizeMap: Map<string, string[]> = new Map();
function localize(funcName, args, typeChecker, fileName) {
    const [typeExpr, nameExpr, locExpr, langExpr] = args;
    const type = getExpressionValue(typeExpr, typeChecker);
    const name = getExpressionValue(nameExpr, typeChecker);
    const loc = getExpressionValue(locExpr, typeChecker);
    let lang = "en";
    if (langExpr)
        lang = getExpressionValue(langExpr, typeChecker);
    let mode = "-name";
    if (funcName == "localizeDescription")
        mode = "-description";
    if (funcName == "localize")
        mode = "";
    const text = `${name}=${loc}`;
    const groupName = `${type}${mode}`;
    let localizeMap = languageMap.get(lang);
    if (!localizeMap)
        localizeMap = new Map();
    if (!localizeMap.has(groupName))
        localizeMap.set(groupName, new Set());
    const groupList = localizeMap.get(groupName);
    groupList.add(text);
    localizeMap.set(groupName, groupList);
    languageMap.set(lang, localizeMap);
    let fileSet = fileMap.get(fileName);
    if (!fileSet)
        fileSet = new Set();
    fileSet.add([lang, groupName, text]);
    fileMap.set(fileName, fileSet);
}
function checkNode(node, program, context) {
    const typeChecker = program.getTypeChecker();
    if (ts.isPropertyAccessExpression(node)) {
        const enumName = getEnumName(node, typeChecker);
        if (enumName) {
            return context.factory.createStringLiteral(cleanText(enumName));
        }
    }
    else if (ts.isExpressionStatement(node)) {
        const expr = node.expression;
        if (!ts.isCallExpression(expr))
            return;
        if (!ts.isIdentifier(expr.expression))
            return;
        const name = expr.expression.getText();
        if (!isLocalizeFunction(name))
            return;
        const fileName = getCleanedFilePath(node);
        localize(name, expr.arguments, typeChecker, fileName);
        return true;
    }
    return;
}
function writeToPath(filePath, content) {
    if (!fs.existsSync(filePath)) {
        fs.mkdirSync(path.dirname(filePath), {
            recursive: true
        });
    }
    fs.writeFileSync(filePath, content);
}
let timeout;
function writeLocalization() {
    if (timeout)
        clearTimeout(timeout);
    timeout = setTimeout(() => {
        timeout = undefined;
        for (const [lang, localizeMap] of languageMap) {
            let localizeText = "";
            for (const [group, entries] of localizeMap) {
                if (entries.size < 1)
                    continue;
                localizeText += `[${group}]\n`;
                for (const entry of entries) {
                    localizeText += `${entry}\n`;
                }
                localizeText += `\n`;
            }
            localizeText = localizeText.slice(0, -1); // remove last newline
            writeToPath(localizeOutput(lang), localizeText);
            console.log(`\nSuccessfully wrote localized string to "locale/${lang}"`);
        }
    }, 100);
}
function getCleanedFilePath(node) {
    const rootPath = "./src";
    const absPath = ts.getOriginalNode(node).getSourceFile().fileName;
    const cleanedPath = absPath.substring(absPath.indexOf(rootPath) + rootPath.length + 1);
    return cleanedPath.replace(".ts", "");
}
function clearForFile(file) {
    if (!fileMap.has(file))
        return;
    for (const [lang, group, text] of fileMap.get(file)) {
        if (!languageMap.has(lang))
            continue;
        const groupMap = languageMap.get(lang);
        if (!groupMap.has(group))
            continue;
        const entries = groupMap.get(group);
        if (!entries.has(text))
            continue;
        entries.delete(text);
    }
}
/**
 * Creates the transformer.
 */
const createTransformer = (program) => context => {
    const visit = node => {
        const newNode = checkNode(node, program, context);
        if (newNode) {
            if (newNode == true)
                return;
            return newNode;
        }
        return ts.visitEachChild(node, visit, context);
    };
    return file => {
        const fileName = getCleanedFilePath(file);
        clearForFile(fileName);
        const res = ts.visitNode(file, visit);
        writeLocalization();
        return res;
    };
};
exports.default = createTransformer;
