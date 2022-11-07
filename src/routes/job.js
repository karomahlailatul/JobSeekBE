const express = require("express");
const router = express.Router();
const jobController = require("../controller/job");
const { protect } = require("../middlewares/auth");

router.get("/", jobController.getPaginationJob);
// router.get("/fulldata", jobController.getPaginationJob_FullData);
router.get("/:id", jobController.getJob);
// router.get("/fulldata/:id", jobController.selectPaginationJob_FullData);
// router.post("/", protect, jobController.insertJob);
router.post("/withskilljob", protect, jobController.insertJob_SkillJob);
// router.put("/:id", protect, jobController.updateJob);
router.put("/withskilljob/:id", protect, jobController.updateJob_SkillJob);
router.delete("/:id", protect, jobController.deleteJob);
router.delete("/selected/:id", protect, jobController.deleteJobSelected);

module.exports = router;
