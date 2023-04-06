// -------------------------------------------------------------------------------
// --FACTORIO MOD: Magitory
// --Factorio + Magic = WOW!
// --Authors: Nibuja, HanniWalter
// --Date: 14.03.2020
// -------------------------------------------------------------------------------

import { DefineDungeonEvents } from "./core/dungeons";

function GetGlobal(key: string) {
	if (!(key in global)) global[key] = {};
	return global[key];
}

function SetGlobal(key: string, val: any) {
	global[key] = val;
}

DefineDungeonEvents();

// if not magitory then magitory = {} end
// if not global then global = {} end

// function magitory:GetGlobal(key)
// 	if not global[key] then global[key] = {} end
// 	return global[key]
// end

// function magitory:SetGlobal(key, val)
// 	state = true
// 	if not global[key] then state = false end
// 	global[key] = val
// end

// function magitory:DefineEvent(name, func)
// 	if not self.eventList then self.eventList = {} end
// 	if not self.eventList[name] then self.eventList[name] = {} end
// 	table.insert(self.eventList[name], func)
// end

// function magitory:ReloadEvents()
// 	if self.eventList then
// 		for eventName,events in pairs(self.eventList) do
// 			script.on_event(defines.events[eventName], function(event)
// 				for _,func in pairs(magitory.eventList[eventName]) do
// 					func(event)
// 				end
// 			end)
// 		end
// 	end
// end

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

// --===================================================
// -- REQUIREMENTS
// require('script.util')
// require('script.vectors')
// require('script.motionController')
// require('script.modifiers')

// require("script.weaponScript")
// require("script.developmentScript")
// require("script.spellScript")
// require("script.spellGui")
// require("script.dungeonScripts.room")

// require("script.dungeonScripts.dungeonMain")

// magitory:ReloadEvents()
