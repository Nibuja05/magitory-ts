"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.canBeFalsyWhenNotNull = exports.canBeFalsy = exports.isFunctionType = exports.isArrayType = exports.forTypeOrAnySupertype = exports.isNumberType = exports.isStringType = exports.typeCanHaveSomeOfFlags = exports.typeAlwaysHasSomeOfFlags = void 0;
const ts = require("typescript");
function typeAlwaysHasSomeOfFlags(context, type, flags) {
    const baseConstraint = context.checker.getBaseConstraintOfType(type);
    if (baseConstraint) {
        type = baseConstraint;
    }
    if (type.flags & flags) {
        return true;
    }
    if (type.isUnion()) {
        return type.types.every(t => typeAlwaysHasSomeOfFlags(context, t, flags));
    }
    if (type.isIntersection()) {
        return type.types.some(t => typeAlwaysHasSomeOfFlags(context, t, flags));
    }
    return false;
}
exports.typeAlwaysHasSomeOfFlags = typeAlwaysHasSomeOfFlags;
function typeCanHaveSomeOfFlags(context, type, flags) {
    const baseConstraint = context.checker.getBaseConstraintOfType(type);
    if (!baseConstraint) {
        // type parameter with no constraint can be anything, assume it might satisfy predicate
        if (type.isTypeParameter())
            return true;
    }
    else {
        type = baseConstraint;
    }
    if (type.flags & flags) {
        return true;
    }
    if (type.isUnion()) {
        return type.types.some(t => typeCanHaveSomeOfFlags(context, t, flags));
    }
    if (type.isIntersection()) {
        return type.types.some(t => typeCanHaveSomeOfFlags(context, t, flags));
    }
    return false;
}
exports.typeCanHaveSomeOfFlags = typeCanHaveSomeOfFlags;
function isStringType(context, type) {
    return typeAlwaysHasSomeOfFlags(context, type, ts.TypeFlags.StringLike);
}
exports.isStringType = isStringType;
function isNumberType(context, type) {
    return typeAlwaysHasSomeOfFlags(context, type, ts.TypeFlags.NumberLike);
}
exports.isNumberType = isNumberType;
function isExplicitArrayType(context, type) {
    if (context.checker.isArrayType(type) || context.checker.isTupleType(type))
        return true;
    if (type.symbol) {
        const baseConstraint = context.checker.getBaseConstraintOfType(type);
        if (baseConstraint && baseConstraint !== type) {
            return isExplicitArrayType(context, baseConstraint);
        }
    }
    if (type.isUnionOrIntersection()) {
        return type.types.some(t => isExplicitArrayType(context, t));
    }
    return false;
}
/**
 * Iterate over a type and its bases until the callback returns true.
 */
function forTypeOrAnySupertype(context, type, predicate) {
    if (predicate(type)) {
        return true;
    }
    if (!type.isClassOrInterface() && type.symbol) {
        type = context.checker.getDeclaredTypeOfSymbol(type.symbol);
    }
    const baseTypes = type.getBaseTypes();
    if (!baseTypes)
        return false;
    return baseTypes.some(superType => forTypeOrAnySupertype(context, superType, predicate));
}
exports.forTypeOrAnySupertype = forTypeOrAnySupertype;
function isArrayType(context, type) {
    return forTypeOrAnySupertype(context, type, t => isExplicitArrayType(context, t));
}
exports.isArrayType = isArrayType;
function isFunctionType(type) {
    return type.getCallSignatures().length > 0;
}
exports.isFunctionType = isFunctionType;
function canBeFalsy(context, type) {
    const strictNullChecks = context.options.strict === true || context.options.strictNullChecks === true;
    if (!strictNullChecks && !type.isLiteral())
        return true;
    const falsyFlags = ts.TypeFlags.Boolean |
        ts.TypeFlags.BooleanLiteral |
        ts.TypeFlags.Never |
        ts.TypeFlags.Void |
        ts.TypeFlags.Unknown |
        ts.TypeFlags.Any |
        ts.TypeFlags.Undefined |
        ts.TypeFlags.Null;
    return typeCanHaveSomeOfFlags(context, type, falsyFlags);
}
exports.canBeFalsy = canBeFalsy;
function canBeFalsyWhenNotNull(context, type) {
    const falsyFlags = ts.TypeFlags.Boolean |
        ts.TypeFlags.BooleanLiteral |
        ts.TypeFlags.Never |
        ts.TypeFlags.Void |
        ts.TypeFlags.Unknown |
        ts.TypeFlags.Any;
    return typeCanHaveSomeOfFlags(context, type, falsyFlags);
}
exports.canBeFalsyWhenNotNull = canBeFalsyWhenNotNull;
//# sourceMappingURL=types.js.map