const express = require("express");
const router = express.Router();
const jobController = require("../controller/job");
const { protect } = require("../middlewares/auth");

router.get("/", jobController.getPaginationJob);
router.get("/fulldata", jobController.getPaginationJob_Recruiter_Skill);
router.get("/:id", jobController.getJob);
router.get("/fulldata/:id", jobController.getPaginationJob_Recruiter_Skill_ID);
router.get("/fulldatafromrecuiter/:id", jobController.getPaginationJob_Recruiter_Skill_From_Recruiter);
router.post("/", protect, jobController.insertJob);
router.put("/:id", protect, jobController.updateJob);
router.delete("/:id", protect, jobController.deleteJob);

module.exports = router;
