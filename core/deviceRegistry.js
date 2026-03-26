const fs = require("fs")
const path = require("path")

const devicesData = JSON.parse(
  fs.readFileSync(path.join(__dirname, "../data/devices.json"), "utf8")
)

function resolveDeviceContext(deviceId) {

  for (const room in devicesData) {

    const entry = devicesData[room][deviceId]

    if (!entry) continue

    return {
      room,
      device: deviceId,
      entry
    }
  }

  return null
}

module.exports = {
  resolveDeviceContext
}