import { Color, ExtendData, getColor, getIcon } from "../types";
import { shadeColor } from "../util";

ExtendData("fluid", {
	name: ItemNames.UnrefinedMana,
	base_color: getColor(ItemNames.UnrefinedMana),
	flow_color: shadeColor(getColor(ItemNames.Mana), 40),
	default_temperature: 15,
	max_temperature: 100,
	heat_capacity: "0.2KJ",
	icon_size: 32,
	icon: getIcon(ItemNames.UnrefinedMana),
	order: `a[fluid]-b[${ItemNames.UnrefinedMana}]`
});
localizeName("fluid", ItemNames.UnrefinedMana, "Unrefined Mana");

ExtendData("fluid", {
	name: ItemNames.Mana,
	base_color: getColor(ItemNames.Mana),
	flow_color: shadeColor(getColor(ItemNames.Mana), 40),
	default_temperature: 15,
	max_temperature: 100,
	heat_capacity: "0.2KJ",
	icon_size: 32,
	icon: getIcon(ItemNames.Mana),
	order: `a[fluid]-b[${ItemNames.Mana}]`
});
localizeName("fluid", ItemNames.Mana, "Pure Mana");

ExtendData("fluid", {
	name: ItemNames.ConcentratedMana,
	base_color: getColor(ItemNames.ConcentratedMana),
	flow_color: shadeColor(getColor(ItemNames.ConcentratedMana), 40),
	default_temperature: 15,
	max_temperature: 100,
	heat_capacity: "0.2KJ",
	icon_size: 32,
	icon: getIcon(ItemNames.Mana),
	order: `a[fluid]-b[${ItemNames.ConcentratedMana}]`
});
localizeName("fluid", ItemNames.ConcentratedMana, "Concentrated Mana");

ExtendData("item", {
	name: BuildingNames.ManaPurifier,
	icon: getIcon("chemical-plant", true),
	icon_size: 64,
	icon_mipmaps: 4,
	subgroup: ItemSubGroups.Buildings,
	order: `e[${BuildingNames.ManaPurifier}]`,
	place_result: BuildingNames.ManaPurifier,
	stack_size: 10
});
localizeName("item", BuildingNames.ManaPurifier, "Mana Purifier");

// {
//     type = "item",
//     name = "chemical-plant",
//     icon = "__base__/graphics/icons/chemical-plant.png",
//     icon_size = 64, icon_mipmaps = 4,
//     subgroup = "production-machine",
//     order = "e[chemical-plant]",
//     place_result = "chemical-plant",
//     stack_size = 10
//   },
