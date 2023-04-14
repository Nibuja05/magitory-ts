export function Color(r = 0, g = r, b = r): Color {
	return { r, g, b };
}

export function Position(x = 0, y = x): Position {
	return { x, y };
}

export function BoundingBox(left_top: Position, right_bottom: Position, orientation?: number): BoundingBox {
	return { left_top, right_bottom, orientation };
}

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

export function getIcon(name: string, base = false) {
	if (base) return `__base__/graphics/icons/${name}.png`;
	return `__magitory__/graphics/icons/${name}.png`;
}
