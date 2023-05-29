import { Color, ExtendData, getColor, getIcon } from "../types";
import { saturateColor, shadeColor } from "../util";

ExtendData("item-group", {
	name: ItemGroups.Base,
	icon: getIcon("spellbook"),
	icon_size: 32
});

ExtendData("item-subgroup", {
	name: ItemSubGroups.Buildings,
	group: ItemGroups.Base
});

ExtendData("recipe-category", {
	name: RecipeCategoryNames.ManaPurification
});

ExtendData("recipe", {
	name: BuildingNames.ManaPurifier,
	energy_required: 5,
	enabled: true,
	ingredients: [
		["steel-plate", 5],
		["iron-gear-wheel", 5],
		["electronic-circuit", 5],
		["pipe", 5]
	],
	result: BuildingNames.ManaPurifier
});
localizeName("recipe", BuildingNames.ManaPurifier, "Mana Purifier");

ExtendData("recipe", {
	name: RecipeNames.ManaRefining,
	category: RecipeCategoryNames.ManaPurification,
	enabled: true,
	energy_required: 2,
	ingredients: [
		{
			type: "fluid",
			name: ItemNames.UnrefinedMana,
			amount: 50
		},
		{
			type: "fluid",
			name: "water",
			amount: 10
		}
	],
	results: [
		{
			type: "fluid",
			name: ItemNames.Mana,
			amount: 25
		}
	],
	icon: getIcon("fluid/heavy-oil-cracking", true),
	icon_size: 64,
	crafting_machine_tint: {
		primary: getColor(ItemNames.Mana),
		secondary: getColor(ItemNames.UnrefinedMana),
		tertiary: shadeColor(getColor(ItemNames.Mana), -10),
		quaternary: saturateColor(shadeColor(getColor(ItemNames.Mana), 20), 20)
	}
});
localizeName("recipe", RecipeNames.ManaRefining, "Mana Purification");
