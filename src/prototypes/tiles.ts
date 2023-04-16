import { Color, ExtendData, getImage, getSound } from "../types";

ExtendData("tile", [
	{
		name: TileNames.DungeonFloor,
		needs_correction: false,
		collision_mask: ["ground-tile"],
		walking_speed_modifier: 1,
		layer: 61,
		variants: {
			main: [
				{
					picture: getImage("terrain/concrete/concrete", true),
					count: 1,
					size: 1
				}
			],
			empty_transitions: true,
			material_background: {
				picture: getImage("terrain/dungeon_concrete"),
				count: 8
			}
		},
		map_color: Color(0.4),
		walking_sound: [
			{
				filename: getSound("walking/concrete-01", true),
				volume: 1
			},
			{
				filename: getSound("walking/concrete-02", true),
				volume: 1
			},
			{
				filename: getSound("walking/concrete-03", true),
				volume: 1
			},
			{
				filename: getSound("walking/concrete-04", true),
				volume: 1
			}
		],
		pollution_absorption_per_second: 0
	},
	{
		name: TileNames.DungeonVoid,
		needs_correction: false,
		collision_mask: ["ground-tile"],
		walking_speed_modifier: 1,
		layer: 61,
		variants: {
			main: [
				{
					picture: getImage("terrain/dungeon_void"),
					count: 1,
					size: 1
				}
			],
			empty_transitions: true,
			material_background: {
				picture: getImage("terrain/dungeon_void"),
				count: 8
			}
		},
		map_color: Color(),
		pollution_absorption_per_second: 0
	}
]);
