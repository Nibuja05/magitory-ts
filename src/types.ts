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

type ColorTypes = ItemNames.Mana | ItemNames.UnrefinedMana;
export function getColor(type: ColorTypes): Color {
	switch (type) {
		// case ItemNames.Mana:
		// 	return Color(0.01, 0.65, 0.37);
		// case ItemNames.UnrefinedMana:
		// 	return Color(0.16, 0.85, 0.55);
		case ItemNames.Mana:
			return Color(0.23, 0.33, 0.83);
		case ItemNames.UnrefinedMana:
			return Color(0.23, 0.55, 0.83);
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
