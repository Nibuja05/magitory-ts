"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.reportInvalidExtensionValue = exports.isIdentifierExtensionValue = void 0;
const language_extensions_1 = require("../../utils/language-extensions");
const diagnostics_1 = require("../../utils/diagnostics");
const extensionKindToValueName = {
    [language_extensions_1.ExtensionKind.MultiFunction]: "$multi",
    [language_extensions_1.ExtensionKind.RangeFunction]: "$range",
    [language_extensions_1.ExtensionKind.VarargConstant]: "$vararg",
};
function isIdentifierExtensionValue(symbol, extensionKind) {
    return symbol !== undefined && extensionKindToValueName[extensionKind] === symbol.name;
}
exports.isIdentifierExtensionValue = isIdentifierExtensionValue;
function reportInvalidExtensionValue(context, identifier, extensionKind) {
    if (extensionKind === language_extensions_1.ExtensionKind.MultiFunction) {
        context.diagnostics.push((0, diagnostics_1.invalidMultiFunctionUse)(identifier));
    }
    else if (extensionKind === language_extensions_1.ExtensionKind.RangeFunction) {
        context.diagnostics.push((0, diagnostics_1.invalidRangeUse)(identifier));
    }
    else if (extensionKind === language_extensions_1.ExtensionKind.VarargConstant) {
        context.diagnostics.push((0, diagnostics_1.invalidVarargUse)(identifier));
    }
}
exports.reportInvalidExtensionValue = reportInvalidExtensionValue;
//# sourceMappingURL=identifier.js.map