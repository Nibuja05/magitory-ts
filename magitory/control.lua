function GetGlobal(key)
    if not (global[key] ~= nil) then
        global[key] = {}
    end
    return global[key]
end
function SetGlobal(key, val)
    global[key] = val
end
function DefineEvent(name, func)
end
