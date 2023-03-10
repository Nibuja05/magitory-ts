"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.findUsedLualibFeatures = exports.buildMinimalLualibBundle = exports.getLualibBundleReturn = exports.getLuaLibBundle = exports.loadImportedLualibFeatures = exports.loadInlineLualibFeatures = exports.resolveRecursiveLualibFeatures = exports.readLuaLibFeature = exports.getLuaLibExportToFeatureMap = exports.getLuaLibModulesInfo = exports.luaLibModulesInfoFileName = exports.resolveLuaLibDir = exports.LuaLibFeature = void 0;
const path = require("path");
const lua = require("./LuaAST");
const CompilerOptions_1 = require("./CompilerOptions");
const utils_1 = require("./utils");
var LuaLibFeature;
(function (LuaLibFeature) {
    LuaLibFeature["ArrayConcat"] = "ArrayConcat";
    LuaLibFeature["ArrayEntries"] = "ArrayEntries";
    LuaLibFeature["ArrayEvery"] = "ArrayEvery";
    LuaLibFeature["ArrayFilter"] = "ArrayFilter";
    LuaLibFeature["ArrayForEach"] = "ArrayForEach";
    LuaLibFeature["ArrayFind"] = "ArrayFind";
    LuaLibFeature["ArrayFindIndex"] = "ArrayFindIndex";
    LuaLibFeature["ArrayFrom"] = "ArrayFrom";
    LuaLibFeature["ArrayIncludes"] = "ArrayIncludes";
    LuaLibFeature["ArrayIndexOf"] = "ArrayIndexOf";
    LuaLibFeature["ArrayIsArray"] = "ArrayIsArray";
    LuaLibFeature["ArrayJoin"] = "ArrayJoin";
    LuaLibFeature["ArrayMap"] = "ArrayMap";
    LuaLibFeature["ArrayPush"] = "ArrayPush";
    LuaLibFeature["ArrayPushArray"] = "ArrayPushArray";
    LuaLibFeature["ArrayReduce"] = "ArrayReduce";
    LuaLibFeature["ArrayReduceRight"] = "ArrayReduceRight";
    LuaLibFeature["ArrayReverse"] = "ArrayReverse";
    LuaLibFeature["ArrayUnshift"] = "ArrayUnshift";
    LuaLibFeature["ArraySort"] = "ArraySort";
    LuaLibFeature["ArraySlice"] = "ArraySlice";
    LuaLibFeature["ArraySome"] = "ArraySome";
    LuaLibFeature["ArraySplice"] = "ArraySplice";
    LuaLibFeature["ArrayToObject"] = "ArrayToObject";
    LuaLibFeature["ArrayFlat"] = "ArrayFlat";
    LuaLibFeature["ArrayFlatMap"] = "ArrayFlatMap";
    LuaLibFeature["ArraySetLength"] = "ArraySetLength";
    LuaLibFeature["Await"] = "Await";
    LuaLibFeature["Class"] = "Class";
    LuaLibFeature["ClassExtends"] = "ClassExtends";
    LuaLibFeature["CloneDescriptor"] = "CloneDescriptor";
    LuaLibFeature["CountVarargs"] = "CountVarargs";
    LuaLibFeature["Decorate"] = "Decorate";
    LuaLibFeature["DecorateParam"] = "DecorateParam";
    LuaLibFeature["Delete"] = "Delete";
    LuaLibFeature["DelegatedYield"] = "DelegatedYield";
    LuaLibFeature["Error"] = "Error";
    LuaLibFeature["FunctionBind"] = "FunctionBind";
    LuaLibFeature["Generator"] = "Generator";
    LuaLibFeature["InstanceOf"] = "InstanceOf";
    LuaLibFeature["InstanceOfObject"] = "InstanceOfObject";
    LuaLibFeature["Iterator"] = "Iterator";
    LuaLibFeature["LuaIteratorSpread"] = "LuaIteratorSpread";
    LuaLibFeature["Map"] = "Map";
    LuaLibFeature["Match"] = "Match";
    LuaLibFeature["MathAtan2"] = "MathAtan2";
    LuaLibFeature["MathModf"] = "MathModf";
    LuaLibFeature["MathSign"] = "MathSign";
    LuaLibFeature["New"] = "New";
    LuaLibFeature["Number"] = "Number";
    LuaLibFeature["NumberIsFinite"] = "NumberIsFinite";
    LuaLibFeature["NumberIsNaN"] = "NumberIsNaN";
    LuaLibFeature["NumberToString"] = "NumberToString";
    LuaLibFeature["NumberToFixed"] = "NumberToFixed";
    LuaLibFeature["ObjectAssign"] = "ObjectAssign";
    LuaLibFeature["ObjectDefineProperty"] = "ObjectDefineProperty";
    LuaLibFeature["ObjectEntries"] = "ObjectEntries";
    LuaLibFeature["ObjectFromEntries"] = "ObjectFromEntries";
    LuaLibFeature["ObjectGetOwnPropertyDescriptor"] = "ObjectGetOwnPropertyDescriptor";
    LuaLibFeature["ObjectGetOwnPropertyDescriptors"] = "ObjectGetOwnPropertyDescriptors";
    LuaLibFeature["ObjectKeys"] = "ObjectKeys";
    LuaLibFeature["ObjectRest"] = "ObjectRest";
    LuaLibFeature["ObjectValues"] = "ObjectValues";
    LuaLibFeature["ParseFloat"] = "ParseFloat";
    LuaLibFeature["ParseInt"] = "ParseInt";
    LuaLibFeature["Promise"] = "Promise";
    LuaLibFeature["PromiseAll"] = "PromiseAll";
    LuaLibFeature["PromiseAllSettled"] = "PromiseAllSettled";
    LuaLibFeature["PromiseAny"] = "PromiseAny";
    LuaLibFeature["PromiseRace"] = "PromiseRace";
    LuaLibFeature["Set"] = "Set";
    LuaLibFeature["SetDescriptor"] = "SetDescriptor";
    LuaLibFeature["SparseArrayNew"] = "SparseArrayNew";
    LuaLibFeature["SparseArrayPush"] = "SparseArrayPush";
    LuaLibFeature["SparseArraySpread"] = "SparseArraySpread";
    LuaLibFeature["WeakMap"] = "WeakMap";
    LuaLibFeature["WeakSet"] = "WeakSet";
    LuaLibFeature["SourceMapTraceBack"] = "SourceMapTraceBack";
    LuaLibFeature["Spread"] = "Spread";
    LuaLibFeature["StringAccess"] = "StringAccess";
    LuaLibFeature["StringCharAt"] = "StringCharAt";
    LuaLibFeature["StringCharCodeAt"] = "StringCharCodeAt";
    LuaLibFeature["StringEndsWith"] = "StringEndsWith";
    LuaLibFeature["StringIncludes"] = "StringIncludes";
    LuaLibFeature["StringPadEnd"] = "StringPadEnd";
    LuaLibFeature["StringPadStart"] = "StringPadStart";
    LuaLibFeature["StringReplace"] = "StringReplace";
    LuaLibFeature["StringReplaceAll"] = "StringReplaceAll";
    LuaLibFeature["StringSlice"] = "StringSlice";
    LuaLibFeature["StringSplit"] = "StringSplit";
    LuaLibFeature["StringStartsWith"] = "StringStartsWith";
    LuaLibFeature["StringSubstr"] = "StringSubstr";
    LuaLibFeature["StringSubstring"] = "StringSubstring";
    LuaLibFeature["StringTrim"] = "StringTrim";
    LuaLibFeature["StringTrimEnd"] = "StringTrimEnd";
    LuaLibFeature["StringTrimStart"] = "StringTrimStart";
    LuaLibFeature["Symbol"] = "Symbol";
    LuaLibFeature["SymbolRegistry"] = "SymbolRegistry";
    LuaLibFeature["TypeOf"] = "TypeOf";
    LuaLibFeature["Unpack"] = "Unpack";
})(LuaLibFeature = exports.LuaLibFeature || (exports.LuaLibFeature = {}));
function resolveLuaLibDir(luaTarget) {
    const luaLibDir = luaTarget === CompilerOptions_1.LuaTarget.Lua50 ? "5.0" : "universal";
    return path.resolve(__dirname, path.join("..", "dist", "lualib", luaLibDir));
}
exports.resolveLuaLibDir = resolveLuaLibDir;
exports.luaLibModulesInfoFileName = "lualib_module_info.json";
const luaLibModulesInfo = new Map();
function getLuaLibModulesInfo(luaTarget, emitHost) {
    if (!luaLibModulesInfo.has(luaTarget)) {
        const lualibPath = path.join(resolveLuaLibDir(luaTarget), exports.luaLibModulesInfoFileName);
        const result = emitHost.readFile(lualibPath);
        if (result !== undefined) {
            luaLibModulesInfo.set(luaTarget, JSON.parse(result));
        }
        else {
            throw new Error(`Could not load lualib dependencies from '${lualibPath}'`);
        }
    }
    return luaLibModulesInfo.get(luaTarget);
}
exports.getLuaLibModulesInfo = getLuaLibModulesInfo;
// This caches the names of lualib exports to their LuaLibFeature, avoiding a linear search for every lookup
const lualibExportToFeature = new Map();
function getLuaLibExportToFeatureMap(luaTarget, emitHost) {
    if (!lualibExportToFeature.has(luaTarget)) {
        const luaLibModulesInfo = getLuaLibModulesInfo(luaTarget, emitHost);
        const map = new Map();
        for (const [feature, info] of Object.entries(luaLibModulesInfo)) {
            for (const exportName of info.exports) {
                map.set(exportName, feature);
            }
        }
        lualibExportToFeature.set(luaTarget, map);
    }
    return lualibExportToFeature.get(luaTarget);
}
exports.getLuaLibExportToFeatureMap = getLuaLibExportToFeatureMap;
const lualibFeatureCache = new Map();
function readLuaLibFeature(feature, luaTarget, emitHost) {
    const featureMap = (0, utils_1.getOrUpdate)(lualibFeatureCache, luaTarget, () => new Map());
    if (!featureMap.has(feature)) {
        const featurePath = path.join(resolveLuaLibDir(luaTarget), `${feature}.lua`);
        const luaLibFeature = emitHost.readFile(featurePath);
        if (luaLibFeature === undefined) {
            throw new Error(`Could not load lualib feature from '${featurePath}'`);
        }
        featureMap.set(feature, luaLibFeature);
    }
    return featureMap.get(feature);
}
exports.readLuaLibFeature = readLuaLibFeature;
function resolveRecursiveLualibFeatures(features, luaTarget, emitHost, luaLibModulesInfo = getLuaLibModulesInfo(luaTarget, emitHost)) {
    const loadedFeatures = new Set();
    const result = [];
    function load(feature) {
        var _a;
        if (loadedFeatures.has(feature))
            return;
        loadedFeatures.add(feature);
        const dependencies = (_a = luaLibModulesInfo[feature]) === null || _a === void 0 ? void 0 : _a.dependencies;
        if (dependencies) {
            dependencies.forEach(load);
        }
        result.push(feature);
    }
    for (const feature of features) {
        load(feature);
    }
    return result;
}
exports.resolveRecursiveLualibFeatures = resolveRecursiveLualibFeatures;
function loadInlineLualibFeatures(features, luaTarget, emitHost) {
    return resolveRecursiveLualibFeatures(features, luaTarget, emitHost)
        .map(feature => readLuaLibFeature(feature, luaTarget, emitHost))
        .join("\n");
}
exports.loadInlineLualibFeatures = loadInlineLualibFeatures;
function loadImportedLualibFeatures(features, luaTarget, emitHost) {
    const luaLibModuleInfo = getLuaLibModulesInfo(luaTarget, emitHost);
    const imports = Array.from(features).flatMap(feature => luaLibModuleInfo[feature].exports);
    if (imports.length === 0) {
        return [];
    }
    const requireCall = lua.createCallExpression(lua.createIdentifier("require"), [
        lua.createStringLiteral("lualib_bundle"),
    ]);
    const luaLibId = lua.createIdentifier("____lualib");
    const importStatement = lua.createVariableDeclarationStatement(luaLibId, requireCall);
    const statements = [importStatement];
    // local <export> = ____luaLib.<export>
    for (const item of imports) {
        statements.push(lua.createVariableDeclarationStatement(lua.createIdentifier(item), lua.createTableIndexExpression(luaLibId, lua.createStringLiteral(item))));
    }
    return statements;
}
exports.loadImportedLualibFeatures = loadImportedLualibFeatures;
const luaLibBundleContent = new Map();
function getLuaLibBundle(luaTarget, emitHost) {
    const lualibPath = path.join(resolveLuaLibDir(luaTarget), "lualib_bundle.lua");
    if (!luaLibBundleContent.has(lualibPath)) {
        const result = emitHost.readFile(lualibPath);
        if (result !== undefined) {
            luaLibBundleContent.set(lualibPath, result);
        }
        else {
            throw new Error(`Could not load lualib bundle from '${lualibPath}'`);
        }
    }
    return luaLibBundleContent.get(lualibPath);
}
exports.getLuaLibBundle = getLuaLibBundle;
function getLualibBundleReturn(exportedValues) {
    return `\nreturn {\n${exportedValues.map(exportName => `  ${exportName} = ${exportName}`).join(",\n")}\n}\n`;
}
exports.getLualibBundleReturn = getLualibBundleReturn;
function buildMinimalLualibBundle(features, luaTarget, emitHost) {
    const code = loadInlineLualibFeatures(features, luaTarget, emitHost);
    const moduleInfo = getLuaLibModulesInfo(luaTarget, emitHost);
    const exports = Array.from(features).flatMap(feature => moduleInfo[feature].exports);
    return code + getLualibBundleReturn(exports);
}
exports.buildMinimalLualibBundle = buildMinimalLualibBundle;
function findUsedLualibFeatures(luaTarget, emitHost, luaContents) {
    const features = new Set();
    const exportToFeatureMap = getLuaLibExportToFeatureMap(luaTarget, emitHost);
    for (const lua of luaContents) {
        const regex = /^local (\w+) = ____lualib\.(\w+)$/gm;
        while (true) {
            const match = regex.exec(lua);
            if (!match)
                break;
            const [, localName, exportName] = match;
            if (localName !== exportName)
                continue;
            const feature = exportToFeatureMap.get(exportName);
            if (feature)
                features.add(feature);
        }
    }
    return features;
}
exports.findUsedLualibFeatures = findUsedLualibFeatures;
//# sourceMappingURL=LuaLib.js.map