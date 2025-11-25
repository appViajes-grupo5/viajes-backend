const express = require("express");
const router = express.Router();
const tripController = require("../controllers/tripController");
const { authenticateToken } = require("../middleware/authMiddleware");

// Rutas públicas
router.get("/", tripController.getTrips);
router.get("/:id", tripController.getTrip);

// Rutas protegidas (user autenticado)
router.post("/", authenticateToken, tripController.createTrip);
router.put("/:id", authenticateToken, tripController.updateTrip);
router.delete("/:id", authenticateToken, tripController.deleteTrip);

module.exports = router;
