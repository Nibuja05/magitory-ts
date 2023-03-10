"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getBinaryCallExtensionArgs = exports.getUnaryCallExtensionArg = exports.getNaryCallExtensionArgs = exports.methodExtensionKinds = exports.getIterableExtensionKindForNode = exports.getIterableExtensionTypeForType = exports.isLuaIterable = exports.IterableExtensionKind = exports.getExtensionKindForSymbol = exports.getExtensionKindForNode = exports.getExtensionKindForType = exports.ExtensionKind = void 0;
const ts = require("typescript");
const diagnostics_1 = require("./diagnostics");
var ExtensionKind;
(function (ExtensionKind) {
    ExtensionKind["MultiFunction"] = "MultiFunction";
    ExtensionKind["RangeFunction"] = "RangeFunction";
    ExtensionKind["VarargConstant"] = "VarargConstant";
    ExtensionKind["AdditionOperatorType"] = "Addition";
    ExtensionKind["AdditionOperatorMethodType"] = "AdditionMethod";
    ExtensionKind["SubtractionOperatorType"] = "Subtraction";
    ExtensionKind["SubtractionOperatorMethodType"] = "SubtractionMethod";
    ExtensionKind["MultiplicationOperatorType"] = "Multiplication";
    ExtensionKind["MultiplicationOperatorMethodType"] = "MultiplicationMethod";
    ExtensionKind["DivisionOperatorType"] = "Division";
    ExtensionKind["DivisionOperatorMethodType"] = "DivisionMethod";
    ExtensionKind["ModuloOperatorType"] = "Modulo";
    ExtensionKind["ModuloOperatorMethodType"] = "ModuloMethod";
    ExtensionKind["PowerOperatorType"] = "Power";
    ExtensionKind["PowerOperatorMethodType"] = "PowerMethod";
    ExtensionKind["FloorDivisionOperatorType"] = "FloorDivision";
    ExtensionKind["FloorDivisionOperatorMethodType"] = "FloorDivisionMethod";
    ExtensionKind["BitwiseAndOperatorType"] = "BitwiseAnd";
    ExtensionKind["BitwiseAndOperatorMethodType"] = "BitwiseAndMethod";
    ExtensionKind["BitwiseOrOperatorType"] = "BitwiseOr";
    ExtensionKind["BitwiseOrOperatorMethodType"] = "BitwiseOrMethod";
    ExtensionKind["BitwiseExclusiveOrOperatorType"] = "BitwiseExclusiveOr";
    ExtensionKind["BitwiseExclusiveOrOperatorMethodType"] = "BitwiseExclusiveOrMethod";
    ExtensionKind["BitwiseLeftShiftOperatorType"] = "BitwiseLeftShift";
    ExtensionKind["BitwiseLeftShiftOperatorMethodType"] = "BitwiseLeftShiftMethod";
    ExtensionKind["BitwiseRightShiftOperatorType"] = "BitwiseRightShift";
    ExtensionKind["BitwiseRightShiftOperatorMethodType"] = "BitwiseRightShiftMethod";
    ExtensionKind["ConcatOperatorType"] = "Concat";
    ExtensionKind["ConcatOperatorMethodType"] = "ConcatMethod";
    ExtensionKind["LessThanOperatorType"] = "LessThan";
    ExtensionKind["LessThanOperatorMethodType"] = "LessThanMethod";
    ExtensionKind["GreaterThanOperatorType"] = "GreaterThan";
    ExtensionKind["GreaterThanOperatorMethodType"] = "GreaterThanMethod";
    ExtensionKind["NegationOperatorType"] = "Negation";
    ExtensionKind["NegationOperatorMethodType"] = "NegationMethod";
    ExtensionKind["BitwiseNotOperatorType"] = "BitwiseNot";
    ExtensionKind["BitwiseNotOperatorMethodType"] = "BitwiseNotMethod";
    ExtensionKind["LengthOperatorType"] = "Length";
    ExtensionKind["LengthOperatorMethodType"] = "LengthMethod";
    ExtensionKind["TableNewType"] = "TableNew";
    ExtensionKind["TableDeleteType"] = "TableDelete";
    ExtensionKind["TableDeleteMethodType"] = "TableDeleteMethod";
    ExtensionKind["TableGetType"] = "TableGet";
    ExtensionKind["TableGetMethodType"] = "TableGetMethod";
    ExtensionKind["TableHasType"] = "TableHas";
    ExtensionKind["TableHasMethodType"] = "TableHasMethod";
    ExtensionKind["TableSetType"] = "TableSet";
    ExtensionKind["TableSetMethodType"] = "TableSetMethod";
    ExtensionKind["TableAddKeyType"] = "TableAddKey";
    ExtensionKind["TableAddKeyMethodType"] = "TableAddKeyMethod";
})(ExtensionKind = exports.ExtensionKind || (exports.ExtensionKind = {}));
const extensionValues = new Set(Object.values(ExtensionKind));
function getExtensionKindForType(context, type) {
    const value = getPropertyValue(context, type, "__tstlExtension");
    if (value && extensionValues.has(value)) {
        return value;
    }
}
exports.getExtensionKindForType = getExtensionKindForType;
const excludedTypeFlags = ((1 << 18) - 1) | // All flags from Any...Never
    ts.TypeFlags.Index |
    ts.TypeFlags.NonPrimitive;
function getPropertyValue(context, type, propertyName) {
    if (type.flags & excludedTypeFlags)
        return;
    const property = type.getProperty(propertyName);
    if (!property)
        return undefined;
    const propertyType = context.checker.getTypeOfSymbolAtLocation(property, context.sourceFile);
    if (propertyType.isStringLiteral())
        return propertyType.value;
}
function getExtensionKindForNode(context, node) {
    const originalNode = ts.getOriginalNode(node);
    let type = context.checker.getTypeAtLocation(originalNode);
    if (ts.isOptionalChain(originalNode)) {
        type = context.checker.getNonNullableType(type);
    }
    return getExtensionKindForType(context, type);
}
exports.getExtensionKindForNode = getExtensionKindForNode;
function getExtensionKindForSymbol(context, symbol) {
    const type = context.checker.getTypeOfSymbolAtLocation(symbol, context.sourceFile);
    return getExtensionKindForType(context, type);
}
exports.getExtensionKindForSymbol = getExtensionKindForSymbol;
var IterableExtensionKind;
(function (IterableExtensionKind) {
    IterableExtensionKind["Iterable"] = "Iterable";
    IterableExtensionKind["Pairs"] = "Pairs";
    IterableExtensionKind["PairsKey"] = "PairsKey";
})(IterableExtensionKind = exports.IterableExtensionKind || (exports.IterableExtensionKind = {}));
function isLuaIterable(context, type) {
    return getPropertyValue(context, type, "__tstlIterable") !== undefined;
}
exports.isLuaIterable = isLuaIterable;
function getIterableExtensionTypeForType(context, type) {
    const value = getPropertyValue(context, type, "__tstlIterable");
    if (value && value in IterableExtensionKind) {
        return value;
    }
}
exports.getIterableExtensionTypeForType = getIterableExtensionTypeForType;
function getIterableExtensionKindForNode(context, node) {
    const type = context.checker.getTypeAtLocation(node);
    return getIterableExtensionTypeForType(context, type);
}
exports.getIterableExtensionKindForNode = getIterableExtensionKindForNode;
exports.methodExtensionKinds = new Set([
    ExtensionKind.AdditionOperatorMethodType,
    ExtensionKind.SubtractionOperatorMethodType,
    ExtensionKind.MultiplicationOperatorMethodType,
    ExtensionKind.DivisionOperatorMethodType,
    ExtensionKind.ModuloOperatorMethodType,
    ExtensionKind.PowerOperatorMethodType,
    ExtensionKind.FloorDivisionOperatorMethodType,
    ExtensionKind.BitwiseAndOperatorMethodType,
    ExtensionKind.BitwiseOrOperatorMethodType,
    ExtensionKind.BitwiseExclusiveOrOperatorMethodType,
    ExtensionKind.BitwiseLeftShiftOperatorMethodType,
    ExtensionKind.BitwiseRightShiftOperatorMethodType,
    ExtensionKind.ConcatOperatorMethodType,
    ExtensionKind.LessThanOperatorMethodType,
    ExtensionKind.GreaterThanOperatorMethodType,
    ExtensionKind.NegationOperatorMethodType,
    ExtensionKind.BitwiseNotOperatorMethodType,
    ExtensionKind.LengthOperatorMethodType,
    ExtensionKind.TableDeleteMethodType,
    ExtensionKind.TableGetMethodType,
    ExtensionKind.TableHasMethodType,
    ExtensionKind.TableSetMethodType,
    ExtensionKind.TableAddKeyMethodType,
]);
function getNaryCallExtensionArgs(context, node, kind, numArgs) {
    let expressions;
    if (node.arguments.some(ts.isSpreadElement)) {
        context.diagnostics.push((0, diagnostics_1.invalidSpreadInCallExtension)(node));
        return undefined;
    }
    if (exports.methodExtensionKinds.has(kind)) {
        if (!(ts.isPropertyAccessExpression(node.expression) || ts.isElementAccessExpression(node.expression))) {
            context.diagnostics.push((0, diagnostics_1.invalidMethodCallExtensionUse)(node));
            return undefined;
        }
        if (node.arguments.length < numArgs - 1) {
            // assumed to be TS error
            return undefined;
        }
        expressions = [node.expression.expression, ...node.arguments];
    }
    else {
        if (node.arguments.length < numArgs) {
            // assumed to be TS error
            return undefined;
        }
        expressions = node.arguments;
    }
    return expressions;
}
exports.getNaryCallExtensionArgs = getNaryCallExtensionArgs;
function getUnaryCallExtensionArg(context, node, kind) {
    var _a;
    return (_a = getNaryCallExtensionArgs(context, node, kind, 1)) === null || _a === void 0 ? void 0 : _a[0];
}
exports.getUnaryCallExtensionArg = getUnaryCallExtensionArg;
function getBinaryCallExtensionArgs(context, node, kind) {
    const expressions = getNaryCallExtensionArgs(context, node, kind, 2);
    if (expressions === undefined)
        return undefined;
    return [expressions[0], expressions[1]];
}
exports.getBinaryCallExtensionArgs = getBinaryCallExtensionArgs;
//# sourceMappingURL=language-extensions.js.map