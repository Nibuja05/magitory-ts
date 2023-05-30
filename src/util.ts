import { Color } from "./types";

export function reload_init() {
	global.oneWayTeleport = global.oneWayTeleport || [];
	for (let i = 0; i < global.oneWayTeleport.length; i++) {
		global.oneWayTeleport[i] = OneWayTeleport.fromTable(global.oneWayTeleport[i]);
	}
}

export function GetGlobal(key: string) {
	if (!(key in global)) global[key] = {};
	return global[key];
}

export function SetGlobal(key: string, val: any) {
	global[key] = val;
}

export class OneWayTeleport {
	from_surface: string;
	from_area: BoundingBox;
	to_surface: string;
	to_position: Position;

	constructor(from_surface: string, from_area: BoundingBox, to_surface: string, to_position: Position, from_table = false) {
		this.from_surface = from_surface;
		this.from_area = from_area;
		this.to_surface = to_surface;
		this.to_position = to_position;

		if (!from_table) {
			global.oneWayTeleport = global.oneWayTeleport || [];
			global.oneWayTeleport.push(this);
		}

		DefineEvent(defines.events.on_tick, event => {
			if (event.tick % 9 != 7) return;
			for (const teleporter of global.oneWayTeleport) {
				for (const player of Object.values(game.players)) {
					if (isPositionInArea(player.position, teleporter.from_area)) {
						player.teleport(teleporter.to_position, teleporter.to_surface);
					}
				}
			}
		});
	}

	static fromTable(table: any) {
		return new OneWayTeleport(table.from_surface, table.from_area, table.to_surface, table.to_position, true);
	}
}

//not working in all cases but fine by now i guess
export function overlappingAreas(area1: BoundingBox, area2: BoundingBox): boolean {
	return (
		isPositionInArea({ x: area1.left_top.x, y: area1.left_top.y } as Position, area2) ||
		isPositionInArea({ x: area1.right_bottom.x, y: area1.right_bottom.y } as Position, area2) ||
		isPositionInArea({ x: area1.left_top.x, y: area1.right_bottom.y } as Position, area2) ||
		isPositionInArea({ x: area1.right_bottom.x, y: area1.left_top.y } as Position, area2) ||
		isPositionInArea({ x: area2.left_top.x, y: area2.left_top.y } as Position, area1) ||
		isPositionInArea({ x: area2.right_bottom.x, y: area2.right_bottom.y } as Position, area1) ||
		isPositionInArea({ x: area2.left_top.x, y: area2.right_bottom.y } as Position, area1) ||
		isPositionInArea({ x: area2.right_bottom.x, y: area2.left_top.y } as Position, area1)
	);
}

export function isPositionInArea(position: Position, area: BoundingBox): boolean {
	return (
		position.x >= area.left_top.x &&
		position.x <= area.right_bottom.x &&
		position.y >= area.left_top.y &&
		position.y <= area.right_bottom.y
	);
}

export function debug(...args: any[]) {
	//if (args == null) {
	//	print("NULL");
	//	return;
	//}
	print(...args);

	//let list: any[] = [];
	//if (args == null) {
	//	list.push("null");
	//}
	//for (const arg of args) {
	//	if (arg == null) {
	//		list.push("null");
	//	}
	//	else if (typeof(arg) == "string") {
	//		list.push(arg);
	//	}
	//	else{
	//		game.print("type not suported: " + typeof(arg) ,{ r: 0.2, g: 1, b: 0.7 });
	//		list.push(arg);
	//	}
	//}

	//game.print(list.join(" "),{ r: 0.6, g: 1, b: 0.9 });
}

type EventFunc = (this: void, event: event) => void;
const eventList: Map<defines.events | string, EventFunc[]> = new Map();
/**
 * Define an event. Better to use this than directly script.on_event, as this will support multiple callbacks at the same time
 * @param event event to call
 * @param callback callback function
 */
export function DefineEvent<T extends keyof allEvents>(
	event: defines.events | (T extends string ? T : string),
	callback: (this: void, event: allEvents[T]) => void
) {
	if (!eventList.has(event)) eventList.set(event, []);
	eventList.get(event)!.push(callback as EventFunc);
}

/**
 * Reload the previously defined events
 */
export function ReloadEvents() {
	for (const [name, list] of eventList) {
		script.on_event(name, event => {
			for (const callback of list) {
				callback(event);
			}
		});
	}
}

export function shadeColor(color: Color, value: number): Color {
	const hsl = rgbToHsl(color);
	hsl.l = clamp(hsl.l + value, 0, 100);
	return hslToRgb(hsl);
}

export function saturateColor(color: Color, value: number): Color {
	const hsl = rgbToHsl(color);
	hsl.s = clamp(hsl.s + value, 0, 100);
	return hslToRgb(hsl);
}

type HSLColor = {
	h: number;
	s: number;
	l: number;
};

export function HSLColor(h = 0, s = h, l = h): HSLColor {
	return { h, s, l };
}

function rgbToHsl({ r, g, b }: { r: number; g: number; b: number }): HSLColor {
	const l = Math.max(r, g, b);
	const s = l - Math.min(r, g, b);
	const h = s != 0 ? (l === r ? (g - b) / s : l === g ? 2 + (b - r) / s : 4 + (r - g) / s) : 0;

	return HSLColor(
		60 * h < 0 ? 60 * h + 360 : 60 * h,
		100 * (s != 0 ? (l <= 0.5 ? s / (2 * l - s) : s / (2 - (2 * l - s))) : 0),
		(100 * (2 * l - s)) / 2
	);
}

function hslToRgb({ h, s, l }: { h: number; s: number; l: number }): Color {
	s /= 100;
	l /= 100;
	const k = (n: number) => (n + h / 30) % 12;
	const a = s * Math.min(l, 1 - l);
	const f = (n: number) => l - a * Math.max(-1, Math.min(k(n) - 3, Math.min(9 - k(n), 1)));
	return Color(f(0), f(8), f(4));
}

export function clamp(value: number, min: number, max: number) {
	return Math.max(Math.min(value, max), min);
}
