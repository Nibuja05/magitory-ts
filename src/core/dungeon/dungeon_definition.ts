const basedungeon = {
	type: "dungeon",
	name: "base_dungeon",
	entrance: "base_entrance"
};

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
};

const baseentrance = {
	type: "room",
	name: "base_entrance",
	roomtype: "entrance",
	entrance_position: [
		[0, 0, 0, 0],
		[0, 1, 0, 0],
		[0, 0, 0, 0],
		[0, 0, 0, 0]
	],
	layout: [
		[0, 0, 2, 0],
		[0, 1, 1, 2],
		[2, 1, 1, 2],
		[0, 2, 2, 0]
	]
};

export const dungeons = { base_dungeon: basedungeon };
export const rooms = { base_room: baseroom, base_entrance: baseentrance };
