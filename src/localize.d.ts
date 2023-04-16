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
declare function localize(type: LocalizeGroupRaw, name: string, localization: string, language?: LocalizeLanguages): void;
declare function localizeName(type: LocalizeGroupName, name: string, localization: string, language?: LocalizeLanguages): void;
declare function localizeDescription(
	type: LocalizeGroupDescription,
	name: string,
	localization: string,
	language?: LocalizeLanguages
): void;
