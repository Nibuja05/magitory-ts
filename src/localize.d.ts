type LocalizeLanguages = "en" | "de";
type LocalizeGroupName =
	| "achievement"
	| "ammo-category"
	| "damage-type"
	| "decorative"
	| "entity"
	| "equipment"
	| "fluid"
	| "fuel-category"
	| "item"
	| "map-gen-preset"
	| "mod"
	| "recipe"
	| "technology"
	| "tile"
	| "tips-and-tricks-item"
	| "virtual-signal";
type LocalizeGroupDescription =
	| "achievement"
	| "entity"
	| "map-gen-preset"
	| "mod"
	| "modifier"
	| "technology"
	| "tips-and-tricks-item"
	| "virtual-signal";
type LocalizeGroupRaw =
	| "controls"
	| "story"
	| "shortcut"
	| "autoplace-control-names"
	| "programmable-speaker-instrument"
	| "programmable-speaker-note";
/**
 * Localize a string
 * @param type localization group
 * @param name string
 * @param localization localized string
 * @param language [Optional] Default = en
 */
declare function localize(type: LocalizeGroupRaw, name: string, localization: string, language?: LocalizeLanguages): void;
/**
 * Localize a string name
 * @param type localization group [adds -name]
 * @param name string
 * @param localization localized string
 * @param language [Optional] Default = en
 */
declare function localizeName(type: LocalizeGroupName, name: string, localization: string, language?: LocalizeLanguages): void;
/**
 * Localize a string description
 * @param type localization group [adds -description]
 * @param name string
 * @param localization localized string
 * @param language [Optional] Default = en
 */
declare function localizeDescription(
	type: LocalizeGroupDescription,
	name: string,
	localization: string,
	language?: LocalizeLanguages
): void;
