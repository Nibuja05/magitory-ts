local ____lualib = require("lualib_bundle")
local __TS__SourceMapTraceBack = ____lualib.__TS__SourceMapTraceBack
__TS__SourceMapTraceBack(debug.getinfo(1).short_src, {["5"] = 5,["6"] = 12});
local ____exports = {}
local setting = {type = "int-setting", name = "fluid-void-extra-speedmultiplier", setting_type = "runtime-global", default_value = 5}
data:extend({setting})
return ____exports
