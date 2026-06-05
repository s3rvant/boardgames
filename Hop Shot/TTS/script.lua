function onLoad()
    ramp = {
        obj = getObjectFromGUID('7558f2'),
        dif = 0
    }
end

function adjust(item)
    item.obj.setLock(true)
    local pos = item.obj.getPosition()
    if pos.y > 2.5 then
        item.dif = 0.04
        pos.y = pos.y - item.dif
        item.obj.setPosition(pos)
    else
        item.dif = 0
    end
    Wait.time(
        function()
        local pos = item.obj.getPosition()
        pos.y = pos.y + item.dif
        item.obj.setPosition(pos)
        item.obj.setLock(false)
        end,
        1
    )
end

function onObjectFlick(object,player,impulse)
    adjust(ramp)
end