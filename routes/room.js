const express = require("express")
const router = express.Router()

const deviceService = require("../services/deviceService")
const devicesData = require("../data/devices.json")

function normalizeState(stateData) {
  return typeof stateData === "boolean"
    ? stateData
    : stateData?.state ?? false
}

router.get("/:room", async (req, res) => {

  const { room } = req.params
  const roomData = devicesData[room]

  if (!roomData) {
    return res.status(404).json({ error: "Room not found" })
  }

  const devices = []

  for (const key in roomData) {

    const entry = roomData[key]

    // 🔹 GRUPO
    if (Array.isArray(entry)) {

      try {
        const firstDevice = entry[0]
        const stateData = await deviceService.getDeviceState(firstDevice)

        devices.push({
          id: key,
          type: "group",
          state: normalizeState(stateData)
        })

      } catch {
        devices.push({
          id: key,
          type: "group",
          state: false
        })
      }

      continue
    }

    // 🔹 DEVICE INDIVIDUAL
    if (entry.tuyaId) {

      try {
        const stateData = await deviceService.getDeviceState(key)

        devices.push({
          id: key,
          type: "device",
          state: normalizeState(stateData)
        })

      } catch {
        devices.push({
          id: key,
          type: "device",
          state: false
        })
      }
    }
  }

  res.json({ room, devices })

})

module.exports = router