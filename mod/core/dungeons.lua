local ____lualib = require("lualib_bundle")
local __TS__SourceMapTraceBack = ____lualib.__TS__SourceMapTraceBack
__TS__SourceMapTraceBack(debug.getinfo(1).short_src, {["5"] = 6,["6"] = 7,["7"] = 7,["8"] = 7,["9"] = 8,["10"] = 11,["11"] = 12,["12"] = 13,["15"] = 17,["17"] = 19,["18"] = 20,["20"] = 24,["21"] = 25,["22"] = 28,["23"] = 26,["26"] = 21,["29"] = 35,["30"] = 7,["31"] = 7,["32"] = 6});
local ____exports = {}
function ____exports.DefineDungeonEvents(self)
    script.on_event(
        defines.events.on_chunk_generated,
        function(event)
            event.surface.destroy_decoratives({area = event.area})
            for ____, entity in ipairs(event.surface.find_entities(event.area)) do
                if entity.type ~= "character" then
                    entity.destroy({})
                end
            end
            local tiles = {}
            do
                local x = event.area.left_top.x
                while x < event.area.right_bottom.x do
                    do
                        local y = event.area.left_top.y
                        while y < event.area.right_bottom.y do
                            tiles[#tiles + 1] = {name = "concrete", position = {x = x, y = y}}
                            y = y + 1
                        end
                    end
                    x = x + 1
                end
            end
            event.surface.set_tiles(tiles)
        end
    )
end
return ____exports
