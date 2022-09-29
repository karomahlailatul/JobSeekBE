const express = require("express");
const router = express.Router();
const recuiterController = require("../controller/recuiter");
const { protect } = require("../middlewares/auth");
const upload = require("../middlewares/upload");

router.get("/", recuiterController.getPaginationRecuiter);
router.get("/:id", recuiterController.getRecuiter);
router.post("/", protect, upload.single("logo"), recuiterController.insertRecuiter);
router.put("/:id", protect, upload.single("logo"), recuiterController.updateRecuiter);
router.delete("/:id", protect, recuiterController.deleteRecuiter);

router.post("/on-register", recuiterController.insertRecuiterOnRegister);

module.exports = router;
