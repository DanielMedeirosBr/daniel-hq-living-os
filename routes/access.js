const express = require("express");
const router = express.Router();
const accesController = require("../controllers/accessController");

router.get("/:key",accesController.resolveAccess);
module.exports = router;