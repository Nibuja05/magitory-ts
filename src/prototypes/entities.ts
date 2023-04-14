import { BoundingBox, Color, ExtendData, Position, getIcon } from "../types";

ExtendData("resource", {
	name: ItemNames.Mana,
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
	stage_counts: [0],
	stages: {
		sheet: {
			filename: "__base__/graphics/entity/crude-oil/crude-oil.png",
			priority: "extra-high",
			frame_count: 4,
			variation_count: 1,
			width: 60,
			height: 60
		}
	},
	map_color: Color(0, 0, 0.6),
	map_grid: false
});
