/**
 * Creates a type that is a union of multiple interfaces. Each interface has base properties and its unique own properties as well.
 * *Use `FilteredExtension` instead (has same functions + more)*
 * @param B base properties
 * @param T list of interfaces with special properties
 * @deprecated
 */
type Extension<B extends object, T extends object[]> = T extends [infer K, ...infer U]
	? U extends object[]
		? (B & K) | Extension<B, U>
		: B | K
	: never;

/**
 * Checks if type `S` extends type `T`
 */
type SuperType<S, T> = S extends T ? T : S;

/**
 * If this type is ONLY undefined, null or never, it will return the other type `O` (defaults to never)
 */
type NoUndef<T, O = never> = NonNullable<T> extends never ? O : T;

/**
 * Filters a list of objects to only contain objects that can extend a given restriction.
 * If no restriction is given, it returns an unfiltered list.
 * @param L list of objects
 * @param R restricting object (to extend from)
 */
type FilterObjectList<L extends object[], R extends object | undefined = undefined> = R extends object
	? L extends [infer K, ...infer U]
		? U extends object[]
			? K extends R
				? [K, ...FilterObjectList<U, R>]
				: [...FilterObjectList<U, R>]
			: [K]
		: []
	: L;

/**
 * Defines an object list that meets specific restricting conditions.
 * @param R restricting object (to extend from)
 */
type CreateObjectList<R extends object | undefined = undefined> = R extends object ? Array<R> : object[];

/**
 * Creates a type that is a union of multiple interfaces. Each interface has base properties and its unique own properties as well.
 * @param B base properties
 * @param R restricting object (to extend from) | skip and define **T**
 * @param T list of interfaces with special properties
 */
type FilteredExtension<
	B extends object,
	R extends object | undefined,
	T extends CreateObjectList<R> | undefined = undefined
> = T extends object[] ? Extension<B, T> : R extends object[] ? Extension<B, R> : never;

/**
 * Returns a union of the members of a readonly array; otherwise the type of the array
 */
type TupleValues<T> = T extends readonly [infer S, ...infer U] ? S | TupleValues<U> : T extends Array<infer S> ? S : never;

type ClassAttributes<T> = { [K in keyof T as T[K] extends Function ? never : K]: T[K] };
