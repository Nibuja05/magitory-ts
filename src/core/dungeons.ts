

class Dungeon {
	// The position of the dungeon
	position: Position;
	//surfaces of the dungeon
	surfaces: LuaSurface[];
	// The surface of the dungeon entrance
	entranceSurface: LuaSurface;

	constructor(position: Position, surface: LuaSurface) {
		this.position = position;
		this.entranceSurface = surface;
		this.surfaces = [];


		this.createEntrance();
	}

	// create the dungeon entrance
	createEntrance() {
		game.player?.print("Creating dungeon entrance");
		const entranceArea = { left_top: this.position, right_bottom: { x: (this.position as {x: number, y: number}).x + 10 , y: (this.position as {x: number, y: number}).y + 10 } as Position, orientation: 0};
		//clearChunk(this.entranceSurface, entranceArea);
	}


}


function clearChunk(surface: LuaSurface, area: BoundingBox) {
	surface.destroy_decoratives({
		area: area,
	});
	for (const entity of surface.find_entities(area)) {
		if (entity.type != "character") {
			entity.destroy({});
		}
	}
	const tiles = [];
		for (
			let x = (area.left_top as {x: number, y: number}).x;
			x < (area.left_top as {x: number, y: number}).x;
			x++
		) {
			for (
				let y = (area.left_top as {x: number, y: number}).y;
				y < (area.left_top as {x: number, y: number}).y;
				y++
			) {
				tiles.push({
					name: "concrete",
					position: { x, y }
				});
			}
		}

		surface.set_tiles(tiles);

}

export function GenerateDungeon(position: Position, surface: LuaSurface) {
	if (global.dungeons == null) {
		global.dungeons = [];
	}
	
	global.dungeons.push(new Dungeon(position, surface));

}



export function DefineDungeonEvents() {

	script.on_init(() => {
		game.player?.print("Dungeons mod loaded");
		GenerateDungeon({ x: 10, y: 10 }, game.surfaces[0]);
	});
	
	script.on_event(defines.events.on_chunk_generated, (event)  => {
		if (event.surface.name == "nauvis") {
			for (const dungeon of global.dungeons) {
				const area = event.area;
				
				if (
					(area.left_top as {x: number; y: number}).x >= dungeon.position.x &&
					(area.left_top as {x: number; y:number}).y >= dungeon.position.y &&
					(area.right_bottom as {x: number; y: number}) <= dungeon.position.x + 10 &&
					(area.right_bottom  as {x: number; y: number}) <= dungeon.position.y + 10
				) {
					dungeon.createEntrance();	
				}
			}
		}

	});

	script.on_event(defines.events.on_tick, (event) => {
		game.player?.print((game.player.position as {x: number, y: number}).x + ","+ (game.player.position as {x: number, y: number}).y);
	});
};
