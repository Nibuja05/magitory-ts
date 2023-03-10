"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.shouldMultiReturnCallBeWrapped = exports.isInMultiReturnFunction = exports.isMultiFunctionNode = exports.isMultiReturnCall = exports.returnsMultiType = exports.isMultiFunctionCall = exports.canBeMultiReturnType = exports.isMultiReturnType = void 0;
const ts = require("typescript");
const extensions = require("../../utils/language-extensions");
const language_extensions_1 = require("../../utils/language-extensions");
const typescript_1 = require("../../utils/typescript");
const multiReturnExtensionName = "__tstlMultiReturn";
function isMultiReturnType(type) {
    return type.getProperty(multiReturnExtensionName) !== undefined;
}
exports.isMultiReturnType = isMultiReturnType;
function canBeMultiReturnType(type) {
    return ((type.flags & ts.TypeFlags.Any) !== 0 ||
        isMultiReturnType(type) ||
        (type.isUnion() && type.types.some(t => canBeMultiReturnType(t))));
}
exports.canBeMultiReturnType = canBeMultiReturnType;
function isMultiFunctionCall(context, expression) {
    return isMultiFunctionNode(context, expression.expression);
}
exports.isMultiFunctionCall = isMultiFunctionCall;
function returnsMultiType(context, node) {
    const signature = context.checker.getResolvedSignature(node);
    const type = signature === null || signature === void 0 ? void 0 : signature.getReturnType();
    return type ? isMultiReturnType(type) : false;
}
exports.returnsMultiType = returnsMultiType;
function isMultiReturnCall(context, expression) {
    return ts.isCallExpression(expression) && returnsMultiType(context, expression);
}
exports.isMultiReturnCall = isMultiReturnCall;
function isMultiFunctionNode(context, node) {
    return (ts.isIdentifier(node) &&
        node.text === "$multi" &&
        (0, language_extensions_1.getExtensionKindForNode)(context, node) === extensions.ExtensionKind.MultiFunction);
}
exports.isMultiFunctionNode = isMultiFunctionNode;
function isInMultiReturnFunction(context, node) {
    const declaration = (0, typescript_1.findFirstNodeAbove)(node, ts.isFunctionLike);
    if (!declaration) {
        return false;
    }
    const signature = context.checker.getSignatureFromDeclaration(declaration);
    const type = signature === null || signature === void 0 ? void 0 : signature.getReturnType();
    return type ? isMultiReturnType(type) : false;
}
exports.isInMultiReturnFunction = isInMultiReturnFunction;
function shouldMultiReturnCallBeWrapped(context, node) {
    if (!returnsMultiType(context, node)) {
        return false;
    }
    const parent = (0, typescript_1.findFirstNonOuterParent)(node);
    // Variable declaration with destructuring
    if (ts.isVariableDeclaration(parent) && ts.isArrayBindingPattern(parent.name)) {
        return false;
    }
    // Variable assignment with destructuring
    if (ts.isBinaryExpression(parent) &&
        parent.operatorToken.kind === ts.SyntaxKind.EqualsToken &&
        ts.isArrayLiteralExpression(parent.left)) {
        return false;
    }
    // Spread operator
    if (ts.isSpreadElement(parent)) {
        return false;
    }
    // Stand-alone expression
    if (ts.isExpressionStatement(parent)) {
        return false;
    }
    // Forwarded multi-return call
    if ((ts.isReturnStatement(parent) || ts.isArrowFunction(parent)) && // Body-less arrow func
        isInMultiReturnFunction(context, node)) {
        return false;
    }
    // Element access expression 'foo()[0]' will be optimized using 'select'
    if (ts.isElementAccessExpression(parent)) {
        return false;
    }
    // LuaIterable in for...of
    if (ts.isForOfStatement(parent) &&
        (0, language_extensions_1.getIterableExtensionKindForNode)(context, node) === language_extensions_1.IterableExtensionKind.Iterable) {
        return false;
    }
    return true;
}
exports.shouldMultiReturnCallBeWrapped = shouldMultiReturnCallBeWrapped;
//# sourceMappingURL=multi.js.map