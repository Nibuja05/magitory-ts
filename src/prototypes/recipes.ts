import { ExtendData, getIcon } from "../types";

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
	icon_size: 32
	// subgroup: "magitory-fluids"
});
