local ____lualib = require("lualib_bundle")
local __TS__SourceMapTraceBack = ____lualib.__TS__SourceMapTraceBack
__TS__SourceMapTraceBack(debug.getinfo(1).short_src, {["5"] = 8,["6"] = 8,["7"] = 10,["8"] = 11,["9"] = 11,["11"] = 12,["12"] = 10,["13"] = 15,["14"] = 16,["15"] = 15,["16"] = 19});
local ____exports = {}
local ____dungeons = require("core.dungeons")
local DefineDungeonEvents = ____dungeons.DefineDungeonEvents
local function GetGlobal(self, key)
    if not (global[key] ~= nil) then
        global[key] = {}
    end
    return global[key]
end
local function SetGlobal(self, key, val)
    global[key] = val
end
DefineDungeonEvents(nil)
return ____exports
