"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isVarargConstantNode = exports.isGlobalVarargConstant = void 0;
const extensions = require("../../utils/language-extensions");
const language_extensions_1 = require("../../utils/language-extensions");
const scope_1 = require("../../utils/scope");
function isGlobalVarargConstant(context, symbol, scope) {
    return scope.type === scope_1.ScopeType.File && isVarargConstantSymbol(context, symbol);
}
exports.isGlobalVarargConstant = isGlobalVarargConstant;
function isVarargConstantSymbol(context, symbol) {
    return (symbol.getName() === "$vararg" &&
        (0, language_extensions_1.getExtensionKindForSymbol)(context, symbol) === extensions.ExtensionKind.VarargConstant);
}
function isVarargConstantNode(context, node) {
    const symbol = context.checker.getSymbolAtLocation(node);
    return symbol !== undefined && isVarargConstantSymbol(context, symbol);
}
exports.isVarargConstantNode = isVarargConstantNode;
//# sourceMappingURL=vararg.js.map