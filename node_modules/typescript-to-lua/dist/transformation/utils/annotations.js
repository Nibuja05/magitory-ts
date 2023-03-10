"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getFileAnnotations = exports.getNodeAnnotations = exports.getTypeAnnotations = exports.getSymbolAnnotations = exports.AnnotationKind = void 0;
const ts = require("typescript");
var AnnotationKind;
(function (AnnotationKind) {
    AnnotationKind["CustomConstructor"] = "customConstructor";
    AnnotationKind["CompileMembersOnly"] = "compileMembersOnly";
    AnnotationKind["NoResolution"] = "noResolution";
    AnnotationKind["NoSelf"] = "noSelf";
    AnnotationKind["NoSelfInFile"] = "noSelfInFile";
})(AnnotationKind = exports.AnnotationKind || (exports.AnnotationKind = {}));
const annotationValues = new Map(Object.values(AnnotationKind).map(k => [k.toLowerCase(), k]));
function collectAnnotations(source, annotationsMap) {
    var _a, _b;
    for (const tag of source.getJsDocTags()) {
        const tagName = annotationValues.get(tag.name.toLowerCase());
        if (!tagName)
            continue;
        const annotation = {
            kind: tag.name,
            args: (_b = (_a = tag.text) === null || _a === void 0 ? void 0 : _a.map(p => p.text)) !== null && _b !== void 0 ? _b : [],
        };
        annotationsMap.set(tagName, annotation);
    }
}
const symbolAnnotations = new WeakMap();
function getSymbolAnnotations(symbol) {
    const known = symbolAnnotations.get(symbol);
    if (known)
        return known;
    const annotationsMap = new Map();
    collectAnnotations(symbol, annotationsMap);
    symbolAnnotations.set(symbol, annotationsMap);
    return annotationsMap;
}
exports.getSymbolAnnotations = getSymbolAnnotations;
function getTypeAnnotations(type) {
    // types are not frequently repeatedly polled for annotations, so it's not worth caching them
    const annotationsMap = new Map();
    if (type.symbol) {
        getSymbolAnnotations(type.symbol).forEach((value, key) => {
            annotationsMap.set(key, value);
        });
    }
    if (type.aliasSymbol) {
        getSymbolAnnotations(type.aliasSymbol).forEach((value, key) => {
            annotationsMap.set(key, value);
        });
    }
    return annotationsMap;
}
exports.getTypeAnnotations = getTypeAnnotations;
const nodeAnnotations = new WeakMap();
function getNodeAnnotations(node) {
    const known = nodeAnnotations.get(node);
    if (known)
        return known;
    const annotationsMap = new Map();
    collectAnnotationsFromTags(annotationsMap, ts.getAllJSDocTags(node, ts.isJSDocUnknownTag));
    nodeAnnotations.set(node, annotationsMap);
    return annotationsMap;
}
exports.getNodeAnnotations = getNodeAnnotations;
function collectAnnotationsFromTags(annotationsMap, tags) {
    for (const tag of tags) {
        const tagName = annotationValues.get(tag.tagName.text.toLowerCase());
        if (!tagName)
            continue;
        annotationsMap.set(tagName, { kind: tagName, args: getTagArgsFromComment(tag) });
    }
}
const fileAnnotations = new WeakMap();
function getFileAnnotations(sourceFile) {
    const known = fileAnnotations.get(sourceFile);
    if (known)
        return known;
    const annotationsMap = new Map();
    if (sourceFile.statements.length > 0) {
        // Manually collect jsDoc because `getJSDocTags` includes tags only from closest comment
        const jsDoc = sourceFile.statements[0].jsDoc;
        if (jsDoc) {
            for (const jsDocElement of jsDoc) {
                if (jsDocElement.tags) {
                    collectAnnotationsFromTags(annotationsMap, jsDocElement.tags);
                }
            }
        }
    }
    fileAnnotations.set(sourceFile, annotationsMap);
    return annotationsMap;
}
exports.getFileAnnotations = getFileAnnotations;
function getTagArgsFromComment(tag) {
    if (tag.comment) {
        if (typeof tag.comment === "string") {
            return tag.comment.split(" ");
        }
        else {
            return tag.comment.map(part => part.text);
        }
    }
    return [];
}
//# sourceMappingURL=annotations.js.map