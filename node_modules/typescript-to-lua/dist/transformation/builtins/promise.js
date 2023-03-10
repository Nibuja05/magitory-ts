"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createStaticPromiseFunctionAccessor = exports.transformPromiseConstructorCall = exports.createPromiseIdentifier = exports.isPromiseClass = void 0;
const lua = require("../../LuaAST");
const diagnostics_1 = require("../utils/diagnostics");
const lualib_1 = require("../utils/lualib");
const call_1 = require("../visitors/call");
const typescript_1 = require("../utils/typescript");
function isPromiseClass(context, node) {
    if (node.text !== "Promise")
        return false;
    const type = context.checker.getTypeAtLocation(node);
    return (0, typescript_1.isStandardLibraryType)(context, type, undefined);
}
exports.isPromiseClass = isPromiseClass;
function createPromiseIdentifier(original) {
    return lua.createIdentifier("__TS__Promise", original);
}
exports.createPromiseIdentifier = createPromiseIdentifier;
function transformPromiseConstructorCall(context, node, calledMethod) {
    const signature = context.checker.getResolvedSignature(node);
    const params = (0, call_1.transformArguments)(context, node.arguments, signature);
    const expressionName = calledMethod.name.text;
    switch (expressionName) {
        case "all":
            return (0, lualib_1.transformLuaLibFunction)(context, lualib_1.LuaLibFeature.PromiseAll, node, ...params);
        case "allSettled":
            return (0, lualib_1.transformLuaLibFunction)(context, lualib_1.LuaLibFeature.PromiseAllSettled, node, ...params);
        case "any":
            return (0, lualib_1.transformLuaLibFunction)(context, lualib_1.LuaLibFeature.PromiseAny, node, ...params);
        case "race":
            return (0, lualib_1.transformLuaLibFunction)(context, lualib_1.LuaLibFeature.PromiseRace, node, ...params);
        case "resolve":
            (0, lualib_1.importLuaLibFeature)(context, lualib_1.LuaLibFeature.Promise);
            return lua.createCallExpression(createStaticPromiseFunctionAccessor("resolve", calledMethod), params, node);
        case "reject":
            (0, lualib_1.importLuaLibFeature)(context, lualib_1.LuaLibFeature.Promise);
            return lua.createCallExpression(createStaticPromiseFunctionAccessor("reject", calledMethod), params, node);
        default:
            context.diagnostics.push((0, diagnostics_1.unsupportedProperty)(calledMethod.name, "Promise", expressionName));
    }
}
exports.transformPromiseConstructorCall = transformPromiseConstructorCall;
function createStaticPromiseFunctionAccessor(functionName, node) {
    return lua.createTableIndexExpression(lua.createIdentifier("__TS__Promise"), lua.createStringLiteral(functionName), node);
}
exports.createStaticPromiseFunctionAccessor = createStaticPromiseFunctionAccessor;
//# sourceMappingURL=promise.js.map