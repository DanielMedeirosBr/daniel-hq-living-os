const express = require("express")
const router = express.Router()

const deviceService = require("../services/deviceService")
const eventBus = require("../core/eventBus")

router.get("/:id/:action", async (req, res) => {

  const { id, action } = req.params
  const room = req.query.room || null

  try {

    // 🔹 CONSULTA DIRETA (não passa pelo EventBus)
    if (action === "state") {
      const result = await deviceService.getDeviceState(id)
      return res.json(result)
    }

    // 🔹 AÇÃO → EVENTBUS
    eventBus.emitEvent("device.action", {
      id,
      action,
      room,
      source: "api"
    })

    // 🔹 RESPOSTA
    const isBrowser = req.headers.accept?.includes("text/html")

    if (isBrowser) {
      return res.redirect(`/${room || "master"}`)
    }

    return res.json({ success: true })

  } catch (err) {
    return res.status(400).json({ error: err.message })
  }

})

module.exports = router