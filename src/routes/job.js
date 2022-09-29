const express = require("express");
const router = express.Router();
const jobController = require("../controller/job");
const { protect } = require("../middlewares/auth");

router.get("/", jobController.getPaginationJob);
router.get("/fulldata", jobController.getPaginationJob_Recuiter_Skill);
router.get("/fulldata/:id", jobController.getPaginationJob_Recuiter_Skill_ID);
router.get("/:id", jobController.getJob);
router.post("/", protect, jobController.insertJob);
router.put("/:id", protect, jobController.updateJob);
router.delete("/:id", protect, jobController.deleteJob);

module.exports = router;
