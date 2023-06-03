import { DefineEvent, overlappingAreas } from "../../util";
import { OneWayTeleport } from "../../util";
import { dungeon_prototypes, room_prototypes } from "./dungeon_definition";
class Room {
	constructor() {}
}

//basic concepts:
//to make dungeon generation easier, we will use a grid system
//a grid is a 8x8 area of tiles
//grids are stored in a sparse matrice
//eception for the grids in the dungeon_definiton.ts file, they are stored in a 2d array for easier prototyping

//cant construct on init, because the game is not yet initialized
export class Dungeon {
	number: number;
	entrance: Position; // top left corner of the entrance
	rooms: Room[];
	dungeon_type: string;

	gird: Map<string, number> = new Map<string, number>();
	surface_name: string;
	entrance_is_generated: boolean = false;
	first_room_is_generated: boolean = false;

	constructor(entrance: Position, dungeon_type: string) {
		this.entrance = entrance;
		this.rooms = [];

		this.number = global.dungeons.length;
		this.dungeon_type = dungeon_type;
		this.surface_name = "dungeon_" + this.number;
		this.generate_surface();
	}

	generate_surface() {
		const surface = game.create_surface(this.surface_name);
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
			this.surface_name,
			{
				x: 0,
				y: 0
			} as Position
		);
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
	}

	_noroom = [0, 2];
	_room = [1, 10, 11];
	//room
	generate_room(roomtype: string, position: Position, orientation: number) {
		const prototype = room_prototypes[roomtype];
		const _layout = prototype.layout;
		const layout = sparse_matrice_transformation(grid_to_sparse_matrice(_layout), orientation, { x: 1, y: 1 } as Position);

		const tiles = [];
		for (const [position, value] of layout) {
			const x = Number(position.split("_")[0]);
			const y = Number(position.split("_")[1]);

			if (this._noroom.includes(value)) continue;
			print("x: " + x + " y: " + y + " value: " + value);
			//corners
			tiles.push({
				name: "concrete",
				position: { x: x * 9, y: y * 9 }
			});
			tiles.push({
				name: "concrete",
				position: { x: x * 9 + 9, y: y * 9 }
			});
			tiles.push({
				name: "concrete",
				position: { x: x * 9, y: y * 9 + 9 }
			});
			tiles.push({
				name: "concrete",
				position: { x: x * 9 + 9, y: y * 9 + 9 }
			});

			//between corners (wall places)
		}
		print(this.get_surface().name);
		this.get_surface().set_tiles(tiles);
		print("roomtype: " + roomtype);
	}
}

function sparse_matrice_transformation(matrice: Map<string, number>, rotation: number, center: Position): Map<string, number> {
	let new_matrice = new Map<string, number>();
	for (const [position, value] of matrice) {
		let x = Number(position.split("_")[0]);
		let y = Number(position.split("_")[1]);

		//centering
		x -= center.x;
		y -= center.y;

		//rotation
		for (let i = 0; i < rotation; i++) {
			const old_x = x;
			const old_y = y;
			x = old_y;
			y = -old_x;
		}

		//saving
		new_matrice.set(position_to_string(x + center.x, y + center.y), value);
	}
	return new_matrice;
}
function grid_to_sparse_matrice(grid: number[][]) {
	const matrice = new Map<string, number>();
	for (let x = 0; x < grid.length; x++) {
		for (let y = 0; y < grid[x].length; y++) {
			if (grid[x][y] == 0) continue;
			matrice.set(position_to_string(x, y), grid[x][y]);
		}
	}
	return matrice;
}

function position_to_string(x: number, y: number): string {
	return x + "_" + y;
}

function onTick(event: on_tick) {
	//debug(game.get_player(1).position.x, game.get_player(1).position.y);
}

function on_chunk_charted(event: on_chunk_charted) {
	const surface_name = game.surfaces[event.surface_index].name;
	for (const dungeon of global.dungeons) {
		if (surface_name == dungeon.surface_name) {
			if (!dungeon.first_room_is_generated) {
				const first_room = dungeon_prototypes[dungeon.dungeon_type].first_room;

				dungeon.generate_room(first_room, { x: 0, y: 0 } as Position, 0);
				dungeon.first_room_is_generated = true;
			}
		}
	}
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

function on_init() {
	global.dungeons = [];
	const dungeon = new Dungeon({ x: 10, y: 10 }, "base_dungeon");
	global.dungeons.push(dungeon);
}

export function DefineDungeon() {
	DefineEvent(defines.events.on_chunk_generated, event => {
		onChunkGenerated(event);
	});
	DefineEvent(defines.events.on_chunk_charted, event => {
		on_chunk_charted(event);
	});
	DefineEvent(defines.events.on_tick, event => {
		onTick(event);
	});
	script.on_init(() => {
		on_init();
	});
}
