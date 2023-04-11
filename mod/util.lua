local ____lualib = require("lualib_bundle")
local Map = ____lualib.Map
local __TS__New = ____lualib.__TS__New
local __TS__SourceMapTraceBack = ____lualib.__TS__SourceMapTraceBack
__TS__SourceMapTraceBack(debug.getinfo(1).short_src, {["6"] = 1,["7"] = 2,["8"] = 2,["10"] = 3,["11"] = 1,["12"] = 6,["13"] = 7,["14"] = 6,["15"] = 17,["16"] = 19,["17"] = 23,["18"] = 23,["20"] = 24,["21"] = 24,["22"] = 19,["23"] = 27,["24"] = 27});
function GetGlobal(self, key)
    if not (global[key] ~= nil) then
        global[key] = {}
    end
    return global[key]
end
function SetGlobal(self, key, val)
    global[key] = val
end
eventList = __TS__New(Map)
function DefineEvent(self, event, callback)
    if not eventList:has(event) then
        eventList:set(event, {})
    end
    local ____temp_0 = eventList:get(event)
    ____temp_0[#____temp_0 + 1] = callback
end
function ReloadEvents(self)
end
