local ____lualib = require("lualib_bundle")
local Map = ____lualib.Map
local __TS__New = ____lualib.__TS__New
local __TS__Iterator = ____lualib.__TS__Iterator
local __TS__SourceMapTraceBack = ____lualib.__TS__SourceMapTraceBack
__TS__SourceMapTraceBack(debug.getinfo(1).short_src, {["8"] = 1,["9"] = 2,["10"] = 2,["12"] = 3,["13"] = 1,["14"] = 6,["15"] = 7,["16"] = 6,["17"] = 11,["22"] = 17,["23"] = 18,["24"] = 18,["26"] = 19,["27"] = 19,["28"] = 17,["29"] = 22,["30"] = 22,["31"] = 22,["32"] = 22,["33"] = 22,["34"] = 22,["36"] = 27,["37"] = 28,["38"] = 28,["39"] = 28,["40"] = 29,["41"] = 29,["42"] = 29,["43"] = 30,["44"] = 31,["46"] = 29,["47"] = 29,["49"] = 27});
local ____exports = {}
function ____exports.GetGlobal(self, key)
    if not (global[key] ~= nil) then
        global[key] = {}
    end
    return global[key]
end
function ____exports.SetGlobal(self, key, val)
    global[key] = val
end
local eventList = __TS__New(Map)
--- Define an event. Better to use this than directly script.on_event, as this will support multiple callbacks at the same time
-- 
-- @param event event to call
-- @param callback callback function
function ____exports.DefineEvent(self, event, callback)
    if not eventList:has(event) then
        eventList:set(event, {})
    end
    local ____temp_0 = eventList:get(event)
    ____temp_0[#____temp_0 + 1] = callback
end
local t = ____exports.DefineEvent(
    nil,
    defines.events.on_area_cloned,
    function(event)
    end
)
--- Reload the previously defined events
function ____exports.ReloadEvents(self)
    for ____, ____value in __TS__Iterator(eventList) do
        local name = ____value[1]
        local list = ____value[2]
        script.on_event(
            name,
            function(event)
                for ____, callback in ipairs(list) do
                    callback(event)
                end
            end
        )
    end
end
return ____exports
