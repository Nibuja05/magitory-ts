import { DefineEvent, overlappingAreas } from "../../util";
import { OneWayTeleport } from "../../util";
import { dungeons, rooms } from "./dungeon_definition";
class Room {
	constructor() {}
}

//basic concepts:
//to make dungeon generation easier, we will use a grid system
//a grid is a 8x8 area of tiles
//grids are stored in a sparse matrice
//eception for the grids in the dungeon_definiton.ts file, they are stored in a 2d array for easier prototyping

export class Dungeon {
	number: number;
	entrance: Position; // top left corner of the entrance
	rooms: Room[];

	//grids are stored in a sparse matrice
	//0 = empty not used and not saved
	//1 = occupied (by a room for example)
	//2 = extendable (by a floor or room)
	girds: number[][][] = [];

	entrance_is_generated: boolean = false;

	constructor(entrance: Position) {
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
				right_bottom: { x: position.x + 10, y: position.y + 10 },
				left_top: { x: position.x, y: position.y }
			}
		});
		for (const entity of game.surfaces["nauvis"].find_entities({
			right_bottom: { x: position.x + 10, y: position.y + 10 },
			left_top: { x: position.x, y: position.y }
		} as BoundingBox)) {
			if (entity.type != "character") {
				entity.destroy({ raise_destroy: true, do_cliff_correction: true });
			}
		}

		const surface = game.create_surface("dungeon_" + this.number);
		surface.generate_with_lab_tiles = true;
		surface.show_clouds = false;
		surface.freeze_daytime = true;
		surface.daytime = 0.01;
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

	generate_room(surface: LuaSurface, roomtype: string, position: Position, orientation: number) {}
}

//nope copilot does weitd stuff
function rotate_sparse_matrice(matrice: { x: number; y: number }[], orientation: number, center: Position) {
	const new_matrice = [];
	for (const position of matrice) {
		let x = position.x;
		let y = position.y;

		for (let i = 0; i < orientation; i++) {
			const old_x = x;
			const old_y = y;
			x = old_y;
			y = -old_x;
		}
		new_matrice.push({ x: x + center.x, y: y + center.y });
	}
	return new_matrice;
}

function grid_to_sparse_matrice(grid: number[][]) {
	const matrice = [];
	for (let x = 0; x < grid.length; x++) {
		for (let y = 0; y < grid[x].length; y++) {
			if (grid[x][y] == 0) continue;
			matrice.push({ x, y });
		}
	}
	return matrice;
}

function onTick(event: on_tick) {
	//debug(game.get_player(1).position.x, game.get_player(1).position.y);
}

function onChunkGenerated(event: on_chunk_generated) {
	for (const dungeon of global.dungeons) {
		if (!dungeon.entrance_is_generated) continue;
		if (event.surface.name == "dungeon_" + dungeon.number) {
		} //
	}

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

	const dungeon = new Dungeon({ x: 30, y: 30 });
	global.dungeons.push(dungeon);
}
