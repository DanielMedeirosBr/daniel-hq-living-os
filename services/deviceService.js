const tuyaService = require("./tuyaService")
const { resolveDeviceContext } = require("../core/deviceRegistry")

async function toggleDevice(deviceId) {

  const context = resolveDeviceContext(deviceId)

  if (!context) {
    throw new Error("Device not found")
  }

  const { room, entry } = context

  // 🔹 GRUPO
  if (Array.isArray(entry)) {

    let lastState = null

    for (const member of entry) {

      const memberContext = resolveDeviceContext(member)

      if (!memberContext) continue

      const result = await tuyaService.toggle(memberContext.entry.tuyaId)
      lastState = result.state
    }

    return {
      room,
      device: deviceId,
      state: lastState
    }
  }

  // 🔹 INDIVIDUAL
  const result = await tuyaService.toggle(entry.tuyaId)

  return {
    room,
    device: deviceId,
    state: result.state
  }
}

async function execute(deviceId, action) {

  if (action === "toggle") {
    return toggleDevice(deviceId)
  }

  throw new Error(`Invalid Action: ${action}`)
}

async function getDeviceState(deviceId) {

  const context = resolveDeviceContext(deviceId)

  if (!context) {
    throw new Error("Device not found")
  }

  const { room, entry } = context

  // 🔹 GRUPO
  if (Array.isArray(entry)) {

    // mantém sua decisão original (usar o primeiro)
    const first = resolveDeviceContext(entry[0])

    if (!first) {
      return { room, device: deviceId, state: false }
    }

    const state = await tuyaService.getState(first.entry.tuyaId)

    return { room, device: deviceId, state }
  }

  // 🔹 INDIVIDUAL
  const state = await tuyaService.getState(entry.tuyaId)

  return { room, device: deviceId, state }
}

module.exports = {
  execute,
  getDeviceState
}