const express = require("express");
const router = express.Router();
const recruiterController = require("../controller/recruiter");
const { protect } = require("../middlewares/auth");
const upload = require("../middlewares/upload");

router.get("/", recruiterController.getPaginationRecruiter);
router.get("/:id", recruiterController.getRecruiter);
router.post("/", protect, upload.single("logo"), recruiterController.insertRecruiter);
router.put("/:id", protect, upload.single("logo"), recruiterController.updateRecruiter);
router.delete("/:id", protect, recruiterController.deleteRecruiter);

router.post("/on-register", recruiterController.insertRecruiterOnRegister);

module.exports = router;
