const express = require("express");
const router = express.Router();
const jobApplyController = require("../controller/jobApply");
const { protect } = require("../middlewares/auth");

router.get("/", jobApplyController.getPaginationJobApply);
router.get("/r", jobApplyController.getPaginationJobApplyByRecruiter);
router.get("/u", jobApplyController.getPaginationJobApplyByUsers);
// router.get("/fulldata", jobApplyController.getPaginationJobApply_Users_Job_Recruiter);
router.get("/:id", jobApplyController.getJobApply);
router.post("/", protect, jobApplyController.insertJobApply);
router.put("/:id", protect, jobApplyController.updateJobApply);
router.delete("/:id", protect, jobApplyController.deleteJobApply);

module.exports = router;
