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
	order: "a[fluid]-b[unrefined-mana]"
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
	order: "a[fluid]-b[liquid-mana]"
});
localizeName("fluid", ItemNames.Mana, "Liquid Mana");
