const eventBus = require("../core/eventBus")

exports.executeDevice = (req, res) => {

    const { id, action} = req.params

    eventBus.emitEvent("device.action", {
        id,
        action,
        source: "api"
    })

    res.json({
        accepted: true,
        device: id,
        action
    })
}