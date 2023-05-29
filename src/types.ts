export function ExtendData<K extends keyof dataCollection>(
	type: K,
	table: Omit<dataCollection[K][string], "type"> | Array<Omit<dataCollection[K][string], "type">>
) {
	if (Array.isArray(table)) {
		data.extend(
			table.map(tab => {
				return { type, ...tab };
			})
		);
	} else data.extend([{ type, ...table }]);
}

export function Color(r = 0, g = r, b = r): Color {
	return { r, g, b };
}

export function Position(x = 0, y = x): Position {
	return { x, y };
}

type ColorTypes = ItemNames.Mana | ItemNames.UnrefinedMana | ItemNames.ConcentratedMana;
export function getColor(type: ColorTypes): Color {
	switch (type) {
		case ItemNames.Mana:
			return Color(0.23, 0.33, 0.83);
		case ItemNames.UnrefinedMana:
			return Color(0.23, 0.55, 0.83);
		case ItemNames.ConcentratedMana:
			return Color(0.23, 0.88, 0.83);
		default:
			return Color();
	}
}

export function BoundingBox(left_top: Position, right_bottom: Position, orientation?: number): BoundingBox {
	return { left_top, right_bottom, orientation };
}

export function getIcon(name: string, base = false) {
	return getImage(`icons/${name}`, base);
}

export function getImage(name: string, base = false) {
	if (base) return `__base__/graphics/${name}.png`;
	return `__magitory__/graphics/${name}.png`;
}

export function getSound(name: string, base = false) {
	if (base) return `__base__/sound/${name}.ogg`;
	return `__magitory__/sound/${name}.ogg`;
}

export function make4wayAnimationFromSpritesheet(animation: Animation) {
	type Animation_Hr = Animation & { hr_version?: Animation };
	function makeAnimationLayer(idx: number, anim: Animation): Animation_Hr {
		const startFrame = (anim.frame_count ?? 1) * idx;
		let x = 0;
		let y = 0;
		if (anim.line_length) {
			y = anim.height! * Math.floor(startFrame / (anim.line_length ?? 1));
		} else {
			x = idx * anim.width!;
		}
		return {
			filename: anim.filename,
			priority: anim.priority ?? "high",
			flags: anim.flags,
			x,
			y,
			width: anim.width,
			height: anim.height,
			frame_count: anim.frame_count ?? 1,
			line_length: anim.line_length,
			repeat_count: anim.repeat_count,
			shift: anim.shift,
			draw_as_shadow: anim.draw_as_shadow,
			// force_hr_shadow: anim.force_hr_shadow,
			apply_runtime_tint: anim.apply_runtime_tint,
			animation_speed: anim.animation_speed,
			scale: anim.scale ?? 1,
			tint: anim.tint,
			blend_mode: anim.blend_mode,
			hr_version: undefined
		};
	}

	function makeAnimationLayerWithHrVersion(idx: number, anim: Animation) {
		const animParameters = makeAnimationLayer(idx, anim);
		if (anim.hr_version && anim.hr_version.filename) animParameters.hr_version = makeAnimationLayer(idx, anim.hr_version);
		return animParameters;
	}

	function makeAnimation(idx: number) {
		if (animation.layers) {
			const tab: {
				layers: Animation_Hr[];
			} = {
				layers: []
			};
			for (const val of Object.values(animation.layers)) {
				tab.layers.push(makeAnimationLayerWithHrVersion(idx, val));
			}
			return tab;
		} else {
			return makeAnimationLayerWithHrVersion(idx, animation);
		}
	}

	return {
		north: makeAnimation(0),
		east: makeAnimation(1),
		south: makeAnimation(2),
		west: makeAnimation(3)
	};
}
