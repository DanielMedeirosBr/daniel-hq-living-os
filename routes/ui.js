const express = require("express")
const path = require("path")
const router = express.Router()

router.get("/:room", (req, res) => {
  res.sendFile(path.join(__dirname, "../ui/index.html"))
})

module.exports = router