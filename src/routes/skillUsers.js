const express = require("express");
const router = express.Router();
const skillUsersController = require("../controller/skillUsers");
const { protect } = require("../middlewares/auth");

router.get("/", skillUsersController.getPaginationSkillUsers);
router.get("/:id", skillUsersController.getSkillUsers);
router.post("/", protect, skillUsersController.insertSkillUsers);
router.put("/:id", protect, skillUsersController.updateSkillUsers);
router.delete("/:id", protect, skillUsersController.deleteSkillUsers);

module.exports = router;
