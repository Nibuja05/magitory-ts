"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getIdentifierSymbolId = exports.trackSymbolReference = exports.getSymbolIdOfSymbol = exports.getSymbolInfo = void 0;
const spread_1 = require("../visitors/spread");
const scope_1 = require("./scope");
function getSymbolInfo(context, symbolId) {
    return context.symbolInfoMap.get(symbolId);
}
exports.getSymbolInfo = getSymbolInfo;
function getSymbolIdOfSymbol(context, symbol) {
    return context.symbolIdMaps.get(symbol);
}
exports.getSymbolIdOfSymbol = getSymbolIdOfSymbol;
function trackSymbolReference(context, symbol, identifier) {
    // Track first time symbols are seen
    let symbolId = context.symbolIdMaps.get(symbol);
    if (symbolId === undefined) {
        symbolId = context.nextSymbolId();
        context.symbolIdMaps.set(symbol, symbolId);
        context.symbolInfoMap.set(symbolId, { symbol, firstSeenAtPos: identifier.pos });
    }
    // If isOptimizedVarArgSpread returns true, the identifier will not appear in the resulting Lua.
    // Only the optimized ellipses (...) will be used.
    if (!(0, spread_1.isOptimizedVarArgSpread)(context, symbol, identifier)) {
        (0, scope_1.markSymbolAsReferencedInCurrentScopes)(context, symbolId, identifier);
    }
    return symbolId;
}
exports.trackSymbolReference = trackSymbolReference;
function getIdentifierSymbolId(context, identifier, symbol) {
    if (symbol) {
        return trackSymbolReference(context, symbol, identifier);
    }
}
exports.getIdentifierSymbolId = getIdentifierSymbolId;
//# sourceMappingURL=symbols.js.map