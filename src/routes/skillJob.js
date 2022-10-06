const express = require("express");
const router = express.Router();
const skillJobController = require("../controller/skillJob");
const { protect } = require("../middlewares/auth");

router.get("/", skillJobController.getPaginationskillJob);
router.get("/fulldata", skillJobController.getPaginationSkillJob_Job_Skill);
router.get("/:id", skillJobController.getSkillJob);
router.post("/", protect, skillJobController.insertSkillJob);
router.put("/:id", protect, skillJobController.updateSkillJob);
router.delete("/:id", protect, skillJobController.deleteSkillJob);

module.exports = router;
