import { DefineEvent, overlappingAreas } from "../../util";
import { debug } from "../../util";
import { isPositionInArea } from "../../util";
import { OneWayTeleport } from "../../util";
class Room {
	constructor() {}
}

export class Dungeon {
	number: number;
	entrance: Position; // top left corner of the entrance
	rooms: Room[];

	entrance_is_generated: boolean = false;

	constructor(number: number, entrance: Position) {
		this.entrance = entrance;
		this.rooms = [];

		this.number = global[global.dungeons.length];
	}

	get_surface() {
		return game.surfaces["dungeon_" + this.number];
	}

	generate_entrance(position: Position) {
		if (this.entrance_is_generated) return;
		this.entrance_is_generated = true;

		const tiles = [];
		for (let x = position.x; x < position.x + 10; x++) {
			for (let y = position.y; y < position.y + 10; y++) {
				tiles.push({
					name: "concrete",
					position: { x, y }
				});
			}
		}
		game.surfaces["nauvis"].set_tiles(tiles);
		game.surfaces["nauvis"].destroy_decoratives({
			area: {
				left_top: { x: position.x, y: position.y },
				right_bottom: { x: position.x + 10, y: position.y + 10 }
			}
		});
		game.create_surface("dungeon_" + this.number);
		new OneWayTeleport(
			"nauvis",
			{
				right_bottom: { x: this.entrance.x + 7, y: this.entrance.y + 7 } as Position,
				left_top: { x: this.entrance.x + 3, y: this.entrance.y + 3 } as Position
			} as BoundingBox,
			"dungeon_" + this.number,
			{
				x: 0,
				y: 0
			} as Position
		);
	}
}

function onTick(event: on_tick) {
	//debug(game.get_player(1).position.x, game.get_player(1).position.y);
}

function onChunkGenerated(event: on_chunk_generated) {
	if (event.surface.name != "nauvis") return;

	const position = event.position;
	for (const dungeon of global.dungeons) {
		if (dungeon.entrance_is_generated) continue;
		if (
			overlappingAreas(event.area, {
				left_top: dungeon.entrance,
				right_bottom: { x: dungeon.entrance.x + 10, y: dungeon.entrance.y + 10 } as Position
			} as BoundingBox)
		) {
			dungeon.generate_entrance(dungeon.entrance);
		}
	}
}

export function DefineDungeon() {
	DefineEvent(defines.events.on_chunk_generated, event => {
		onChunkGenerated(event);
	});
	DefineEvent(defines.events.on_tick, event => {
		onTick(event);
	});

	global.dungeons = [];

	const dungeon = new Dungeon(1, { x: 30, y: 30 });
	global.dungeons.push(dungeon);
}
