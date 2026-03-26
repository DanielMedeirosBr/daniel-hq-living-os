const express = require("express")
const path = require("path")

const houseEngine = require("./core/houseEngine")

const accessRoutes = require("./routes/access")
const deviceRoutes = require("./routes/device")
const roomRoutes = require("./routes/room")
const uiRoutes = require("./routes/ui")

const toggle = require("./toggle")

const app = express()

app.use(express.json())

// 📁 STATIC
app.use("/ui", express.static(path.join(__dirname, "ui")))

// 📡 API
app.use("/room", roomRoutes)
app.use("/device", deviceRoutes)
app.use("/access", accessRoutes)

// 🖥️ UI ROUTES
app.use("/ui", uiRoutes)

// 🔁 TOGGLE DEBUG (se ainda precisar)
app.get("/toggle", async (req, res) => {
  try {
    await toggle()
    res.send("OK")
  } catch (e) {
    console.error(e)
    res.status(500).send("ERRO")
  }
})

// 🏠 FALLBACK UI
app.get("/:room", (req, res, next) => {

  const invalid = ["device", "room", "ui", "access", "toggle"]

  if (invalid.includes(req.params.room)) return next()

  res.sendFile(path.join(__dirname, "ui", "index.html"))
})

const PORT = 3000

app.listen(PORT, () => {
  console.log(`Daniel HQ server running on http://192.168.1.17:${PORT}`)
})

// 🚀 START ENGINE
houseEngine.start()