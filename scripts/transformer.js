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
var ts = __importStar(require("typescript"));
function getEnumName(node, typeChecker) {
    var _a;
    var symbol = typeChecker.getSymbolAtLocation(node);
    if (!symbol)
        return;
    if (!symbol.declarations)
        return;
    var declaration = symbol.declarations[0];
    if (!ts.isEnumMember(declaration))
        return;
    return (_a = declaration.initializer) === null || _a === void 0 ? void 0 : _a.getText();
}
function cleanText(text) {
    return text.slice(1, text.length - 1);
}
function checkNode(node, program, context) {
    var typeChecker = program.getTypeChecker();
    if (ts.isPropertyAccessExpression(node)) {
        var name_1 = node.name.getText();
        var enumName = getEnumName(node, typeChecker);
        if (enumName) {
            return context.factory.createStringLiteral(cleanText(enumName));
        }
    }
    return;
}
/**
 * Creates the transformer.
 */
var createTransformer = function (program) {
    return function (context) {
        var visit = function (node) {
            var newNode = checkNode(node, program, context);
            if (newNode)
                return newNode;
            return ts.visitEachChild(node, visit, context);
        };
        return function (file) {
            var res = ts.visitNode(file, visit);
            return res;
        };
    };
};
exports.default = createTransformer;
