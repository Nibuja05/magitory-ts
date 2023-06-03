interface Dungeon_Prototype {
	type: string;
	name: string;
	first_room: string;
}

interface Room_Prototype {
	type: string;
	name: string;
	roomtype: string;
	layout: number[][];
}

const basedungeon = {
	type: "dungeon",
	name: "base_dungeon",
	first_room: "base_entrance"
} as Dungeon_Prototype;

//grids are here stored in a grid thus there is need for emtpy spaces
//0 = empty will only used here
//1 = basic room
//2 = extendable (here can spawn floors)
//10 = entrance from atop
//11 = exit to the upper surface (nauvis)

const baseroom = {
	type: "room",
	name: "base_room",
	roomtype: "empty",
	layout: [
		[0, 2, 2, 0],
		[2, 1, 1, 2],
		[2, 1, 1, 2],
		[0, 2, 2, 0]
	]
} as Room_Prototype;

const baseentrance = {
	type: "room",
	name: "base_entrance",
	roomtype: "entrance",
	layout: [
		[0, 0, 2, 0],
		[0, 10, 1, 2],
		[2, 1, 11, 2],
		[0, 2, 2, 0]
	]
} as Room_Prototype;

export const dungeon_prototypes = { base_dungeon: basedungeon } as Record<string, Dungeon_Prototype>;
export const room_prototypes = { base_room: baseroom, base_entrance: baseentrance } as Record<string, Room_Prototype>;
