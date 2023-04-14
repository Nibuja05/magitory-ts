import { Color, ExtendData, getIcon } from "../types";

ExtendData("fluid", {
	name: ItemNames.UnrefinedMana,
	base_color: Color(0, 0, 0.6),
	flow_color: Color(0.7),
	default_temperature: 15,
	max_temperature: 100,
	heat_capacity: "0.2KJ",
	icon_size: 32,
	icon: getIcon(ItemNames.UnrefinedMana),
	order: "a[fluid]-b[unrefined-mana]"
});

ExtendData("fluid", {
	name: ItemNames.Mana,
	base_color: Color(0, 0.2, 1.0),
	flow_color: Color(0, 0, 0.7),
	default_temperature: 15,
	max_temperature: 100,
	heat_capacity: "0.2KJ",
	icon_size: 32,
	icon: getIcon(ItemNames.Mana),
	order: "a[fluid]-b[liquid-mana]"
});
