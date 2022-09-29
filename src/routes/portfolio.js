const express = require("express");
const router = express.Router();
const portfolioController = require("../controller/portfolio");
const { protect } = require("../middlewares/auth");
const upload = require("../middlewares/upload");

router.get("/", portfolioController.getPaginationPortfolio);
router.get("/:id", portfolioController.getPortfolio);
router.post("/", protect, upload.single("photo"), portfolioController.insertPortfolio);
router.put("/:id", protect, upload.single("photo"), portfolioController.updatePortfolio);
router.delete("/:id", protect, portfolioController.deletePortfolio);

module.exports = router;
