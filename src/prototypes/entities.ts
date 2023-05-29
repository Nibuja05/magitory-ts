import { BoundingBox, Color, ExtendData, Position, getColor, getIcon, getImage, make4wayAnimationFromSpritesheet } from "../types";
import { saturateColor, shadeColor } from "../util";
require("../util");
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

function executeForLayers(animation: Animation4Way, callback: (anim: Animation, hr: boolean) => void) {
	function inLayer(anim: Animation) {
		if (anim.hr_version) callback(anim.hr_version, true);
		callback(anim, false);
	}
	function inAnim(anim: Animation) {
		if (anim.layers) {
			for (const layer of anim.layers) {
				inLayer(layer);
			}
		} else {
			inLayer(anim);
		}
	}
	inAnim(animation.east);
	inAnim(animation.north);
	inAnim(animation.south);
	inAnim(animation.west);
}

function tintMachine(prototype: { animation: Animation4Way }, color: Color) {
	executeForLayers(prototype.animation, (anim, hr) => {
		anim.tint = color;
	});
}

function changeMachineGraphics(prototype: { animation: Animation4Way }, path: string, hrPath: string) {
	executeForLayers(prototype.animation, (anim, hr) => {
		if (anim.draw_as_shadow) return;
		if (!hr) anim.filename = path;
		if (hr) anim.filename = hrPath;
	});
}

const chemicalPlant = data.raw["assembling-machine"]["chemical-plant"];
changeMachineGraphics(chemicalPlant, getImage("entity/mana-purifier/mana-purifier"), getImage("entity/mana-purifier/hr-mana-purifier"));
// printTable(chemicalPlant);

ExtendData("assembling-machine", {
	...chemicalPlant,
	name: BuildingNames.ManaPurifier,
	crafting_categories: [RecipeCategoryNames.ManaPurification]
});

localizeName("entity", BuildingNames.ManaPurifier, "Mana Purifier");
localizeDescription("entity", BuildingNames.ManaPurifier, "Removes inpurities from mana to produce purer forms.");

// ExtendData("assembling-machine", {
// 	name: BuildingNames.ManaPurifier,
// 	crafting_categories: [RecipeCategoryNames.ManaPurification],
// 	energy_source: {
// 		type: "electric",
// 		usage_priority: "secondary-input",
// 		emissions_per_minute: 4
// 	},
// 	crafting_speed: 1,
// 	energy_usage: "100kW",
// 	icon: getIcon("chemical-plant", true),
// 	icon_size: 64,
// 	icon_mipmaps: 4,
// 	flags: ["placeable-neutral", "placeable-player", "player-creation"],
// 	minable: {
// 		mining_time: 0.1,
// 		result: BuildingNames.ManaPurifier
// 	},
// 	max_health: 300,
// 	corpse: "chemical-plant-remnants",
// 	dying_explosion: "chemical-plant-explosion",
// 	collision_box: BoundingBox(Position(-1.2), Position(1.2)),
// 	selection_box: BoundingBox(Position(-1.5), Position(1.5)),
// 	drawing_box: BoundingBox(Position(-1.5, -1.9), Position(1.5)),
// 	// damaged_trigger_effect: hit_effects.entity(),
// 	module_specification: {
// 		module_slots: 3
// 	},
// 	allowed_effects: ["consumption", "speed", "productivity", "pollution"],
// 	animation: make4wayAnimationFromSpritesheet({
// 		layers: [
// 			{
// 				filename: "__base__/graphics/entity/chemical-plant/chemical-plant.png",
// 				width: 108,
// 				height: 148,
// 				frame_count: 24,
// 				line_length: 12,
// 				shift: util.by_pixel(1, -9),
// 				tint: getColor(ItemNames.Mana),
// 				hr_version: {
// 					filename: "__base__/graphics/entity/chemical-plant/hr-chemical-plant.png",
// 					width: 220,
// 					height: 292,
// 					frame_count: 24,
// 					line_length: 12,
// 					shift: util.by_pixel(0.5, -9),
// 					scale: 0.5,
// 					tint: getColor(ItemNames.Mana)
// 				}
// 			},
// 			{
// 				filename: "__base__/graphics/entity/chemical-plant/chemical-plant-shadow.png",
// 				width: 108,
// 				height: 148,
// 				frame_count: 24,
// 				line_length: 12,
// 				draw_as_shadow: true,
// 				shift: util.by_pixel(28, 6),
// 				tint: getColor(ItemNames.Mana),
// 				hr_version: {
// 					filename: "__base__/graphics/entity/chemical-plant/hr-chemical-plant.png",
// 					width: 220,
// 					height: 292,
// 					frame_count: 24,
// 					line_length: 12,
// 					draw_as_shadow: true,
// 					shift: util.by_pixel(27, 6),
// 					scale: 0.5,
// 					tint: getColor(ItemNames.Mana)
// 				}
// 			}
// 		]
// 	}),
// 	working_visualisations: [
// 		{
// 			apply_recipe_tint: "primary",
// 			north_animation: {
// 				filename: "__base__/graphics/entity/chemical-plant/chemical-plant-liquid-north.png",
// 				frame_count: 24,
// 				line_length: 6,
// 				width: 32,
// 				height: 24,
// 				shift: util.by_pixel(24, 14),
// 				hr_version: {
// 					filename: "__base__/graphics/entity/chemical-plant/hr-chemical-plant-liquid-north.png",
// 					frame_count: 24,
// 					line_length: 6,
// 					width: 66,
// 					height: 44,
// 					shift: util.by_pixel(23, 15),
// 					scale: 0.5
// 				}
// 			},
// 			east_animation: {
// 				filename: "__base__/graphics/entity/chemical-plant/chemical-plant-liquid-east.png",
// 				frame_count: 24,
// 				line_length: 6,
// 				width: 36,
// 				height: 18,
// 				shift: util.by_pixel(0, 22),
// 				hr_version: {
// 					filename: "__base__/graphics/entity/chemical-plant/hr-chemical-plant-liquid-east.png",
// 					frame_count: 24,
// 					line_length: 6,
// 					width: 70,
// 					height: 36,
// 					shift: util.by_pixel(0, 22),
// 					scale: 0.5
// 				}
// 			},
// 			south_animation: {
// 				filename: "__base__/graphics/entity/chemical-plant/chemical-plant-liquid-south.png",
// 				frame_count: 24,
// 				line_length: 6,
// 				width: 34,
// 				height: 24,
// 				shift: util.by_pixel(0, 16),
// 				hr_version: {
// 					filename: "__base__/graphics/entity/chemical-plant/hr-chemical-plant-liquid-south.png",
// 					frame_count: 24,
// 					line_length: 6,
// 					width: 66,
// 					height: 42,
// 					shift: util.by_pixel(0, 17),
// 					scale: 0.5
// 				}
// 			},
// 			west_animation: {
// 				filename: "__base__/graphics/entity/chemical-plant/chemical-plant-liquid-west.png",
// 				frame_count: 24,
// 				line_length: 6,
// 				width: 38,
// 				height: 20,
// 				shift: util.by_pixel(-10, 12),
// 				hr_version: {
// 					filename: "__base__/graphics/entity/chemical-plant/hr-chemical-plant-liquid-west.png",
// 					frame_count: 24,
// 					line_length: 6,
// 					width: 74,
// 					height: 36,
// 					shift: util.by_pixel(-10, 13),
// 					scale: 0.5
// 				}
// 			}
// 		},
// 		{
// 			apply_recipe_tint: "secondary",
// 			north_animation: {
// 				filename: "__base__/graphics/entity/chemical-plant/chemical-plant-foam-north.png",
// 				frame_count: 24,
// 				line_length: 6,
// 				width: 32,
// 				height: 22,
// 				shift: util.by_pixel(24, 14),
// 				hr_version: {
// 					filename: "__base__/graphics/entity/chemical-plant/hr-chemical-plant-foam-north.png",
// 					frame_count: 24,
// 					line_length: 6,
// 					width: 62,
// 					height: 42,
// 					shift: util.by_pixel(24, 15),
// 					scale: 0.5
// 				}
// 			},
// 			east_animation: {
// 				filename: "__base__/graphics/entity/chemical-plant/chemical-plant-foam-east.png",
// 				frame_count: 24,
// 				line_length: 6,
// 				width: 34,
// 				height: 18,
// 				shift: util.by_pixel(0, 22),
// 				hr_version: {
// 					filename: "__base__/graphics/entity/chemical-plant/hr-chemical-plant-foam-east.png",
// 					frame_count: 24,
// 					line_length: 6,
// 					width: 68,
// 					height: 36,
// 					shift: util.by_pixel(0, 22),
// 					scale: 0.5
// 				}
// 			},
// 			south_animation: {
// 				filename: "__base__/graphics/entity/chemical-plant/chemical-plant-liquid-south.png",
// 				frame_count: 24,
// 				line_length: 6,
// 				width: 32,
// 				height: 18,
// 				shift: util.by_pixel(0, 18),
// 				hr_version: {
// 					filename: "__base__/graphics/entity/chemical-plant/hr-chemical-plant-liquid-south.png",
// 					frame_count: 24,
// 					line_length: 6,
// 					width: 60,
// 					height: 40,
// 					shift: util.by_pixel(1, 17),
// 					scale: 0.5
// 				}
// 			},
// 			west_animation: {
// 				filename: "__base__/graphics/entity/chemical-plant/chemical-plant-liquid-west.png",
// 				frame_count: 24,
// 				line_length: 6,
// 				width: 36,
// 				height: 16,
// 				shift: util.by_pixel(-10, 14),
// 				hr_version: {
// 					filename: "__base__/graphics/entity/chemical-plant/hr-chemical-plant-liquid-west.png",
// 					frame_count: 24,
// 					line_length: 6,
// 					width: 68,
// 					height: 28,
// 					shift: util.by_pixel(-9, 15),
// 					scale: 0.5
// 				}
// 			}
// 		},
// 		{
// 			apply_recipe_tint: "tertiary",
// 			fadeout: true,
// 			constant_speed: true,
// 			north_position: util.by_pixel_hr(-30, -161),
// 			east_position: util.by_pixel_hr(29, -150),
// 			south_position: util.by_pixel_hr(12, -134),
// 			west_position: util.by_pixel_hr(-32, -130),
// 			render_layer: "wires",
// 			animation: {
// 				filename: "__base__/graphics/entity/chemical-plant/chemical-plant-smoke-outer.png",
// 				frame_count: 47,
// 				line_length: 16,
// 				width: 46,
// 				height: 94,
// 				animation_speed: 0.5,
// 				shift: util.by_pixel(-2, -40),
// 				hr_version: {
// 					filename: "__base__/graphics/entity/chemical-plant/hr-chemical-plant-smoke-outer.png",
// 					frame_count: 47,
// 					line_length: 16,
// 					width: 90,
// 					height: 188,
// 					animation_speed: 0.5,
// 					shift: util.by_pixel(-2, -40),
// 					scale: 0.5
// 				}
// 			}
// 		},
// 		{
// 			apply_recipe_tint: "quaternary",
// 			fadeout: true,
// 			constant_speed: true,
// 			north_position: util.by_pixel_hr(-30, -161),
// 			east_position: util.by_pixel_hr(29, -150),
// 			south_position: util.by_pixel_hr(12, -134),
// 			west_position: util.by_pixel_hr(-32, -130),
// 			render_layer: "wires",
// 			animation: {
// 				filename: "__base__/graphics/entity/chemical-plant/chemical-plant-smoke-inner.png",
// 				frame_count: 47,
// 				line_length: 16,
// 				width: 20,
// 				height: 42,
// 				animation_speed: 0.5,
// 				shift: util.by_pixel(0, -14),
// 				hr_version: {
// 					filename: "__base__/graphics/entity/chemical-plant/hr-chemical-plant-smoke-inner.png",
// 					frame_count: 47,
// 					line_length: 16,
// 					width: 40,
// 					height: 84,
// 					animation_speed: 0.5,
// 					shift: util.by_pixel(0, -14),
// 					scale: 0.5
// 				}
// 			}
// 		}
// 	],
// 	fluid_boxes: [
// 		{
// 			production_type: "input",
// 			pipe_covers: pipecoverspictures(),
// 			base_area: 10,
// 			base_level: -1,
// 			pipe_connections: [
// 				{
// 					type: "input",
// 					position: [-1, -2]
// 				}
// 			]
// 		},

// 		{
// 			production_type: "input",
// 			pipe_covers: pipecoverspictures(),
// 			base_area: 10,
// 			base_level: -1,
// 			pipe_connections: [
// 				{
// 					type: "input",
// 					position: [1, 2]
// 				}
// 			]
// 		},
// 		{
// 			production_type: "output",
// 			pipe_covers: pipecoverspictures(),
// 			base_area: 10,
// 			base_level: 1,
// 			pipe_connections: [
// 				{
// 					type: "output",
// 					position: [-1, 2]
// 				}
// 			]
// 		},
// 		{
// 			production_type: "output",
// 			pipe_covers: pipecoverspictures(),
// 			base_area: 10,
// 			base_level: 1,
// 			pipe_connections: [
// 				{
// 					type: "output",
// 					position: [1, -2]
// 				}
// 			]
// 		}
// 	]
// 	//     water_reflection =
// 	//     {
// 	//       pictures =
// 	//       {
// 	//         filename = "__base__/graphics/entity/chemical-plant/chemical-plant-reflection.png",
// 	//         priority = "extra-high",
// 	//         width = 28,
// 	//         height = 36,
// 	//         shift = util.by_pixel(5, 60),
// 	//         variation_count = 4,
// 	//         scale = 5
// 	//       },
// 	//       rotate = false,
// 	//       orientation_to_variation = true
// 	//     }
// 	//   }
// });
