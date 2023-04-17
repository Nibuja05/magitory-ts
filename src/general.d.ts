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

/** @noResolution */
declare module "resource-autoplace" {
	function resource_autoplace_settings(
		this: void,
		params: {
			/**
			 * name for the type, used as the default autoplace control name and patch set name
			 */
			name: string;
			/**
			 * amount of stuff, on average, to be placed per tile
			 * How much of this stuff (probability * richness) should occur per tile on average near the starting area?
			 **/
			base_density: number;
			/**
			 * name of the patch set; patches sets of the same name and seed1 will overlap; default: name
			 */
			patch_set_name?: string;
			/**
			 * name of the corresponding autoplace control; default: name
			 */
			autoplace_control_name?: string;
			/**
			 * probability of placement at any given tile within a patch; default: 1
			 */
			random_probability?: number;
			/**
			 * number of patches per square kilometer near the starting area
			 */
			base_spots_per_km2?: number;
			/**
			 * yes, no, and there is no special starting area, respectively
			 */
			has_starting_area_placement?: boolean;
			/**
			 * random seed to use when generating patch positions; default: 100
			 */
			seed1?: number;
			order?: string;
			random_spot_size_minimum?: number;
			random_spot_size_maximum?: number;
			/**
			 * Amplitude of spot 'blob noise' relative to typical spot amplitude
			 */
			regular_blob_amplitude_multiplier?: number;
			/**
			 * Amplitude of spot 'blob noise' relative to typical spot amplitude
			 */
			starting_blob_amplitude_multiplier?: number;
			frequency_multiplier?: number;
			size_multiplier?: number;
			/**
			 * additional_richness will be added to richness but does not affect probability of anything being placed at all.
			 * This is NOT automatically compensated for, because that would be difficult to calculate.
			 * The caller will need to compensate for any additional_richness by adjusting base_density.
			 */
			additional_richness?: number;
			/**
			 * richness will be clamped to minimum_richness at the low end anywhere the stuff is otherwise placed
			 * Not automatically compensated for.
			 */
			minimum_richness?: number;
			/**
			 * 'post' as in multiplied after everything else is calculated, including additional_richness
			 * and minimum_richness.
			 */
			richness_post_multiplier?: number;
			/**
			 * rq_factor is the ratio of the radius of a patch to the cube root of its quantity,
			 * i.e. radius of a quantity=1 patch; higher values = fatter, shallower patches
			 * Watch out!  Shallower patches are more heavily thrown off by noise,
			 * so adjust noise amplitude accordingly!
			 */
			regular_rq_factor_multiplier?: number;
			/**
			 * rq_factor is the ratio of the radius of a patch to the cube root of its quantity,
			 * i.e. radius of a quantity=1 patch; higher values = fatter, shallower patches
			 * Watch out!  Shallower patches are more heavily thrown off by noise,
			 * so adjust noise amplitude accordingly!
			 */
			starting_rq_factor_multiplier?: number;
		}
	): AutoplaceSpecification;
}
