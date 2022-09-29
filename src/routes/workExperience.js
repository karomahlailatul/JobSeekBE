const express = require("express");
const router = express.Router();
const workExperienceController = require("../controller/workExperience");
const { protect } = require("../middlewares/auth");

router.get("/", workExperienceController.getPaginationWorkExperience);
router.get("/:id", workExperienceController.getWorkExperience);
router.post("/", protect, workExperienceController.insertWorkExperience);
router.put("/:id", protect, workExperienceController.updateWorkExperience);
router.delete("/:id", protect, workExperienceController.deleteWorkExperience);

module.exports = router;
