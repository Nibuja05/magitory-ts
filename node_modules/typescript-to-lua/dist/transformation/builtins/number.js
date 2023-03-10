"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.transformNumberConstructorCall = exports.transformNumberPrototypeCall = void 0;
const lua = require("../../LuaAST");
const diagnostics_1 = require("../utils/diagnostics");
const lualib_1 = require("../utils/lualib");
const call_1 = require("../visitors/call");
function transformNumberPrototypeCall(context, node, calledMethod) {
    const signature = context.checker.getResolvedSignature(node);
    const params = (0, call_1.transformArguments)(context, node.arguments, signature);
    const caller = context.transformExpression(calledMethod.expression);
    const expressionName = calledMethod.name.text;
    switch (expressionName) {
        case "toString":
            return params.length === 0
                ? lua.createCallExpression(lua.createIdentifier("tostring"), [caller], node)
                : (0, lualib_1.transformLuaLibFunction)(context, lualib_1.LuaLibFeature.NumberToString, node, caller, ...params);
        case "toFixed":
            return (0, lualib_1.transformLuaLibFunction)(context, lualib_1.LuaLibFeature.NumberToFixed, node, caller, ...params);
        default:
            context.diagnostics.push((0, diagnostics_1.unsupportedProperty)(calledMethod.name, "number", expressionName));
    }
}
exports.transformNumberPrototypeCall = transformNumberPrototypeCall;
function transformNumberConstructorCall(context, node, calledMethod) {
    const parameters = (0, call_1.transformArguments)(context, node.arguments);
    const methodName = calledMethod.name.text;
    switch (methodName) {
        case "isNaN":
            return (0, lualib_1.transformLuaLibFunction)(context, lualib_1.LuaLibFeature.NumberIsNaN, node, ...parameters);
        case "isFinite":
            return (0, lualib_1.transformLuaLibFunction)(context, lualib_1.LuaLibFeature.NumberIsFinite, node, ...parameters);
        default:
            context.diagnostics.push((0, diagnostics_1.unsupportedProperty)(calledMethod.name, "Number", methodName));
    }
}
exports.transformNumberConstructorCall = transformNumberConstructorCall;
//# sourceMappingURL=number.js.map