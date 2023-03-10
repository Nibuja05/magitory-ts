"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.transformSourceFile = exports.createVisitorMap = void 0;
const utils_1 = require("../utils");
const context_1 = require("./context");
const visitors_1 = require("./visitors");
function createVisitorMap(customVisitors) {
    const objectVisitorMap = new Map();
    for (const visitors of [visitors_1.standardVisitors, ...customVisitors]) {
        const priority = visitors === visitors_1.standardVisitors ? -Infinity : 0;
        for (const [syntaxKindKey, visitor] of Object.entries(visitors)) {
            if (!visitor)
                continue;
            const syntaxKind = Number(syntaxKindKey);
            const nodeVisitors = (0, utils_1.getOrUpdate)(objectVisitorMap, syntaxKind, () => []);
            const objectVisitor = typeof visitor === "function" ? { transform: visitor, priority } : visitor;
            nodeVisitors.push(objectVisitor);
        }
    }
    const result = new Map();
    for (const [kind, nodeVisitors] of objectVisitorMap) {
        result.set(kind, nodeVisitors.sort((a, b) => { var _a, _b; return ((_a = a.priority) !== null && _a !== void 0 ? _a : 0) - ((_b = b.priority) !== null && _b !== void 0 ? _b : 0); }).map(visitor => visitor.transform));
    }
    return result;
}
exports.createVisitorMap = createVisitorMap;
function transformSourceFile(program, sourceFile, visitorMap) {
    const context = new context_1.TransformationContext(program, sourceFile, visitorMap);
    const [file] = context.transformNode(sourceFile);
    return { file, diagnostics: context.diagnostics };
}
exports.transformSourceFile = transformSourceFile;
//# sourceMappingURL=index.js.map