import * as ts from "typescript";

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

function checkNode(node: ts.Node, program: ts.Program, context: ts.TransformationContext): ts.Node | undefined {
	const typeChecker = program.getTypeChecker();
	if (ts.isPropertyAccessExpression(node)) {
		const name = node.name.getText();
		const enumName = getEnumName(node, typeChecker);
		if (enumName) {
			return context.factory.createStringLiteral(cleanText(enumName));
		}
	}
	return;
}

/**
 * Creates the transformer.
 */
const createTransformer =
	(program: ts.Program): ts.TransformerFactory<ts.SourceFile> =>
	context => {
		const visit: ts.Visitor = node => {
			const newNode = checkNode(node, program, context);
			if (newNode) return newNode;
			return ts.visitEachChild(node, visit, context);
		};
		return file => {
			const res = ts.visitNode(file, visit);
			return res;
		};
	};

export default createTransformer;
