const express = require("express");
const router = express.Router();
const skillController = require("../controller/skill");
const { protect } = require("../middlewares/auth");

router.get("/", skillController.getPaginationSkill);
router.get("/:id", skillController.getSkill);
router.post("/", protect, skillController.insertSkill);
router.put("/:id", protect, skillController.updateSkill);
router.delete("/:id", protect, skillController.deleteSkill);

module.exports = router;
