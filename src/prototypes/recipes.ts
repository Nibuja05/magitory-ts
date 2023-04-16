import { Color, ExtendData, getColor, getIcon } from "../types";
import { saturateColor, shadeColor } from "../util";

ExtendData("recipe", {
	name: RecipeNames.ManaRefining,
	category: "chemistry",
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
