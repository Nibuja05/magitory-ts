import { Color } from "./types";

export function GetGlobal(key: string) {
	if (!(key in global)) global[key] = {};
	return global[key];
}

export function SetGlobal(key: string, val: any) {
	global[key] = val;
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
		// script.on_event(name, event => {
		// 	for (const callback of list) {
		// 		callback(event);
		// 	}
		// });
	}
}

// function print(...)
// 	local args = {...}
// 	local pStr = ""
// 	for _,s in pairs(args) do
// 		if type(s) == "table" then
// 			game.print("table:")
// 			print_table(s, 2)
// 		else
// 			pStr = pStr..tostring(s).."  "
// 		end
// 	end
// 	if pStr ~= "" then
// 		game.print(pStr)
// 	end
// end

// function print_table(t, indent, done)
// 	-- print ( string.format ('PrintTable type %s', type(keys)) )
// 	if t == {} then print("Empty table!") end
// 	if type(t) ~= "table" then return end

// 	done = done or {}
// 	done[t] = true
// 	indent = indent or 0

// 	local l = {}
// 	for k, v in pairs(t) do
// 		table.insert(l, k)
// 	end

// 	table.sort(l)
// 	for k, v in ipairs(l) do
// 		-- Ignore FDesc
// 		if v ~= 'FDesc' then
// 			local value = t[v]

// 			if type(value) == "table" and not done[value] then
// 				done [value] = true
// 				print(string.rep ("\t", indent * 2)..tostring(v)..":")
// 				print_table (value, indent + 2, done)
// 			elseif type(value) == "userdata" and not done[value] then
// 				done [value] = true
// 				print(string.rep ("\t", indent * 2)..tostring(v)..": "..tostring(value))
// 				print_table((getmetatable(value) and getmetatable(value).__index) or getmetatable(value), indent + 2, done)
// 			else
// 				if t.FDesc and t.FDesc[v] then
// 					print(string.rep ("\t", indent * 2)..tostring(t.FDesc[v]))
// 				else
// 					print(string.rep ("\t", indent * 2)..tostring(v)..": "..tostring(value))
// 				end
// 			end
// 		end
// 	end
// end
