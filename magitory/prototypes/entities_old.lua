

function pipe_pictures()
return
{
	straight_vertical_single =
	{
		filename = "__fluid-void-extra__/graphics/straight-vertical-single.png",
		priority = "extra-high",
		width = 80,
		height = 80,
	},
	straight_vertical =
	{
		filename = "__fluid-void-extra__/graphics/straight-vertical.png",
		priority = "extra-high",
		width = 64,
		height = 64,
	},
	straight_vertical_window =
	{
		filename = "__fluid-void-extra__/graphics/straight-vertical-window.png",
		priority = "extra-high",
		width = 64,
		height = 64,
	},
	straight_horizontal_window =
	{
		filename = "__fluid-void-extra__/graphics/straight-horizontal-window.png",
		priority = "extra-high",
		width = 64,
		height = 64,
	},
	straight_horizontal =
	{
		filename = "__fluid-void-extra__/graphics/straight-horizontal.png",
		priority = "extra-high",
		width = 64,
		height = 64,
	},
	corner_up_right =
	{
		filename = "__fluid-void-extra__/graphics/corner-up-right.png",
		priority = "extra-high",
		width = 64,
		height = 64,
	},
	corner_up_left =
	{
		filename = "__fluid-void-extra__/graphics/corner-up-left.png",
		priority = "extra-high",
		width = 64,
		height = 64,
	},
	corner_down_right =
	{
		filename = "__fluid-void-extra__/graphics/corner-down-right.png",
		priority = "extra-high",
		width = 64,
		height = 64,
	},
	corner_down_left =
	{
		filename = "__fluid-void-extra__/graphics/corner-down-left.png",
		priority = "extra-high",
		width = 64,
		height = 64,
	},
	t_up =
	{
		filename = "__fluid-void-extra__/graphics/t-up.png",
		priority = "extra-high",
		width = 64,
		height = 64,
	},
	t_down =
	{
		filename = "__fluid-void-extra__/graphics/t-down.png",
		priority = "extra-high",
		width = 64,
		height = 64,
	},
	t_right =
	{
		filename = "__fluid-void-extra__/graphics/t-right.png",
		priority = "extra-high",
		width = 64,
		height = 64,
	},
	t_left =
	{
		filename = "__fluid-void-extra__/graphics/t-left.png",
		priority = "extra-high",
		width = 64,
		height = 64,
	},
	cross =
	{
		filename = "__fluid-void-extra__/graphics/cross.png",
		priority = "extra-high",
		width = 64,
		height = 64,
	},
	ending_up =
	{
		filename = "__fluid-void-extra__/graphics/ending-up.png",
		priority = "extra-high",
		width = 64,
		height = 64,
	},
	ending_down =
	{
		filename = "__fluid-void-extra__/graphics/ending-down.png",
		priority = "extra-high",
		width = 64,
		height = 64,
	},
	ending_right =
	{
		filename = "__fluid-void-extra__/graphics/ending-right.png",
		priority = "extra-high",
		width = 64,
		height = 64,
	},
	ending_left =
	{
		filename = "__fluid-void-extra__/graphics/ending-left.png",
		priority = "extra-high",
		width = 64,
		height = 64,
	},
	horizontal_window_background =
	{
		filename = "__fluid-void-extra__/graphics/horizontal-window-background.png",
		priority = "extra-high",
		width = 64,
		height = 64,
	},
	vertical_window_background =
	{
		filename = "__fluid-void-extra__/graphics/vertical-window-background.png",
		priority = "extra-high",
		width = 64,
		height = 64,
	},
	fluid_background =
	{
		filename = "__base__/graphics/entity/pipe/fluid-background.png",
		priority = "extra-high",
		width = 32,
		height = 20,
	},
	low_temperature_flow =
	{
		filename = "__base__/graphics/entity/pipe/fluid-flow-low-temperature.png",
		priority = "extra-high",
		width = 160,
		height = 18
	},
	middle_temperature_flow =
	{
		filename = "__base__/graphics/entity/pipe/fluid-flow-medium-temperature.png",
		priority = "extra-high",
		width = 160,
		height = 18
	},
	high_temperature_flow =
	{
		filename = "__base__/graphics/entity/pipe/fluid-flow-high-temperature.png",
		priority = "extra-high",
		width = 160,
		height = 18
	},
	gas_flow =
	{
		filename = "__base__/graphics/entity/pipe/steam.png",
		priority = "extra-high",
		line_length = 10,
		width = 24,
		height = 15,
		frame_count = 60,
		axially_symmetrical = false,
		direction_count = 1,
	}
}
end


data:extend({
	{
		type = "pipe",
		name = "void-pipe",
		icon = "__fluid-void-extra__/graphics/void-pipe.png",
		icon_size = 32,
		flags = {"placeable-neutral", "player-creation"},
		minable = {hardness = 0.2, mining_time = 0.5, result = "void-pipe"},
		max_health = 50,
		corpse = "small-remnants",
		resistances =
		{
			{
				type = "fire",
				percent = 80
			},
			{
				type = "impact",
				percent = 30
			}
		},
		fast_replaceable_group = "pipe",
		collision_box = {{-0.29, -0.29}, {0.29, 0.29}},
		selection_box = {{-0.5, -0.5}, {0.5, 0.5}},
		fluid_box =
		{
			base_area = 1,
			pipe_connections =
			{
				{position = {0, -1}},
				{position = {1, 0}},
				{position = {0, 1}},
				{position = {-1, 0}}
			},
		},
		vehicle_impact_sound = {filename = "__base__/sound/car-metal-impact.ogg", volume = 0.65},
		pictures = pipe_pictures(),
		working_sound =
		{
			sound = {
				filename = "__base__/sound/pipe.ogg", volume = 0.85
			},
			match_volume_to_activity = true,
			max_sounds_per_type = 3
		},
		horizontal_window_bounding_box = {{-0.25, -0.28125}, {0.25, 0.15625}},
		vertical_window_bounding_box = {{-0.28125, -0.5}, {0.03125, 0.125}},
		energy_source = 
		{
			type = "electric",
			usage_priority = "primary-input",
			drain = "50kW",
			emissions_per_minute = 1,
		},
	},
})