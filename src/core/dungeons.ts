import { DefineEvent } from "../util";

type DPosition = {
	x: number;
	y: number;
};

export function DefineDungeonEvents() {
	DefineEvent(defines.events.on_chunk_generated, event => {
		event.surface.destroy_decoratives({
			area: event.area
		});
		for (const entity of event.surface.find_entities(event.area)) {
			if (entity.type != "character") {
				entity.destroy({});
			}
		}

		const tiles = [];
		for (let x = (event.area.left_top as DPosition).x; x < (event.area.right_bottom as DPosition).x; x++) {
			for (let y = (event.area.left_top as DPosition).y; y < (event.area.right_bottom as DPosition).y; y++) {
				tiles.push({
					name: "concrete",
					position: { x, y }
				});
			}
		}

		event.surface.set_tiles(tiles);
	});
}
