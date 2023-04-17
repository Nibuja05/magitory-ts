import { BoundingBox, ExtendData, Position, getColor, getIcon, getImage } from "../types";
import { shadeColor } from "../util";

import * as resource_autoplace from "resource-autoplace";

ExtendData("resource", {
	name: ItemNames.UnrefinedMana,
	icon: getIcon(ItemNames.UnrefinedMana),
	icon_size: 32,
	flags: ["placeable-neutral"],
	category: "basic-fluid",
	order: "a-b-a",
	infinite: true,
	highlight: true,
	minimum: 60000,
	normal: 300000,
	infinite_depletion_amount: 10,
	resource_patch_search_radius: 12,
	tree_removal_probability: 0.7,
	tree_removal_max_distance: 32 * 32,
	minable: {
		mining_time: 1,
		results: [
			{
				type: "fluid",
				name: ItemNames.UnrefinedMana,
				amount_min: 10,
				amount_max: 10,
				probability: 1
			}
		]
	},
	collision_box: BoundingBox(Position(-1.4), Position(1.4)),
	selection_box: BoundingBox(Position(-0.5), Position(0.5)),
	autoplace: resource_autoplace.resource_autoplace_settings({
		name: ItemNames.UnrefinedMana,
		autoplace_control_name: ItemNames.UnrefinedMana,
		order: "c",
		base_density: 8.2,
		base_spots_per_km2: 1.8,
		random_probability: 1 / 48,
		random_spot_size_minimum: 1,
		random_spot_size_maximum: 1,
		additional_richness: 220000,
		regular_rq_factor_multiplier: 1
	}),
	stage_counts: [0],
	stages: {
		sheet: {
			// filename: getImage("entity/crude-oil/crude-oil", true),
			filename: getImage("entity/unrefined-mana"),
			priority: "extra-high",
			frame_count: 4,
			variation_count: 1,
			width: 75,
			height: 61,
			tint: shadeColor(getColor(ItemNames.UnrefinedMana), 10),
			blend_mode: "normal"
		}
	},
	map_color: getColor(ItemNames.UnrefinedMana),
	map_grid: false
});
localizeName("entity", ItemNames.UnrefinedMana, "Source of unrefined mana. Needs to be purified");

ExtendData("autoplace-control", {
	name: ItemNames.UnrefinedMana,
	richness: true,
	order: "b-a",
	category: "resource"
});
localize("autoplace-control-names", ItemNames.UnrefinedMana, "Unrefined Mana");

// unrefined_mana_autoplace =
// {
// 	type = "autoplace-control",
// 	name = "unrefined-mana",
// 	richness = true,
// 	order = "b-a",
// 	category = "resource"
// }
