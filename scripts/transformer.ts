import * as ts from "typescript";
import * as fs from "fs-extra";
import * as path from "path";

function getEnumName(node: ts.Node, typeChecker: ts.TypeChecker) {
	const symbol = typeChecker.getSymbolAtLocation(node);
	if (!symbol) return;
	if (!symbol.declarations) return;
	const declaration = symbol.declarations[0];
	if (!ts.isEnumMember(declaration)) return;
	return declaration.initializer?.getText();
}

function cleanText(text: string): string {
	return text.slice(1, text.length - 1);
}

function isLocalizeFunction(name: string): boolean {
	return name == "localizeName" || name == "localizeDescription";
}

function getExpressionValue(expression: ts.Expression, typeChecker: ts.TypeChecker): string {
	if (ts.isPropertyAccessExpression(expression)) {
		const enumName = getEnumName(expression, typeChecker);
		if (enumName) return cleanText(enumName);
	} else if (ts.isStringLiteral(expression)) {
		return cleanText(expression.getText());
	}
	return "<undefined>";
}

const localizeOutput = (lang: string) => `mod/locale/${lang}/all.cfg`;
const fileMap: Map<string, Set<[string, string, string]>> = new Map();
const languageMap: Map<string, Map<string, Set<string>>> = new Map();
// const localizeMap: Map<string, string[]> = new Map();

function localize(funcName: string, args: ts.NodeArray<ts.Expression>, typeChecker: ts.TypeChecker, fileName: string) {
	const [typeExpr, nameExpr, locExpr, langExpr] = args;
	const type = getExpressionValue(typeExpr, typeChecker);
	const name = getExpressionValue(nameExpr, typeChecker);
	const loc = getExpressionValue(locExpr, typeChecker);

	let lang = "en";
	if (langExpr) lang = getExpressionValue(langExpr, typeChecker);

	let mode = "name";
	if (funcName == "localizeDescription") mode = "description";

	const text = `${name}=${loc}`;

	const groupName = `${type}-${mode}`;

	let localizeMap = languageMap.get(lang);
	if (!localizeMap) localizeMap = new Map();
	if (!localizeMap.has(groupName)) localizeMap.set(groupName, new Set());
	const groupList = localizeMap.get(groupName)!;
	groupList.add(text);
	localizeMap.set(groupName, groupList);
	languageMap.set(lang, localizeMap);

	let fileSet = fileMap.get(fileName);
	if (!fileSet) fileSet = new Set();
	fileSet.add([lang, groupName, text]);
	fileMap.set(fileName, fileSet);
}

function checkNode(node: ts.Node, program: ts.Program, context: ts.TransformationContext): ts.Node | undefined | true {
	const typeChecker = program.getTypeChecker();
	if (ts.isPropertyAccessExpression(node)) {
		const enumName = getEnumName(node, typeChecker);
		if (enumName) {
			return context.factory.createStringLiteral(cleanText(enumName));
		}
	} else if (ts.isExpressionStatement(node)) {
		const expr = node.expression;
		if (!ts.isCallExpression(expr)) return;
		if (!ts.isIdentifier(expr.expression)) return;
		const name = expr.expression.getText();
		if (!isLocalizeFunction(name)) return;
		const fileName = getCleanedFilePath(node);
		localize(name, expr.arguments, typeChecker, fileName);
		return true;
	}
	return;
}

function writeToPath(filePath: string, content: string) {
	if (!fs.existsSync(filePath)) {
		fs.mkdirSync(path.dirname(filePath), {
			recursive: true
		});
	}
	fs.writeFileSync(filePath, content);
}

let timeout: NodeJS.Timeout | undefined;
function writeLocalization() {
	if (timeout) clearTimeout(timeout);

	timeout = setTimeout(() => {
		timeout = undefined;
		for (const [lang, localizeMap] of languageMap) {
			let localizeText = "";
			for (const [group, entries] of localizeMap) {
				if (entries.size < 1) continue;
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

function getCleanedFilePath(node: ts.Node): string {
	const rootPath = "./src";
	const absPath = ts.getOriginalNode(node).getSourceFile().fileName;
	const cleanedPath = absPath.substring(absPath.indexOf(rootPath) + rootPath.length + 1);
	return cleanedPath.replace(".ts", "");
}

function clearForFile(file: string) {
	if (!fileMap.has(file)) return;
	for (const [lang, group, text] of fileMap.get(file)!) {
		if (!languageMap.has(lang)) continue;
		const groupMap = languageMap.get(lang)!;
		if (!groupMap.has(group)) continue;
		const entries = groupMap.get(group)!;
		if (!entries.has(text)) continue;
		entries.delete(text);
	}
}

/**
 * Creates the transformer.
 */
const createTransformer =
	(program: ts.Program): ts.TransformerFactory<ts.SourceFile> =>
	context => {
		const visit: ts.Visitor = node => {
			const newNode = checkNode(node, program, context);
			if (newNode) {
				if (newNode == true) return;
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

export default createTransformer;
