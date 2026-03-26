const eventBus = require('./eventBus')
const deviceService = require('../services/deviceService')

class HouseEngine {

  start() {
    this.registerEvents()
  }

  registerEvents() {

    eventBus.onEvent("device.action", async (ctx) => {

      const { id, action } = ctx.payload

      const result = await deviceService.execute(id, action)
      const realState = await deviceService.getDeviceState(id)

      ctx.result = result || { success: true }
      ctx.payload.state = realState?.state ?? null
    })

  }

}

module.exports = new HouseEngine()