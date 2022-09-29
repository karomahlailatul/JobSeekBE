const express = require("express");
const router = express.Router();

const usersRouter = require("./users");
const skillRouter = require("./skill")
const workExperienceRouter = require("./workExperience")
const portfolioRouter = require("./portfolio")
const skillUsersRouter = require("./skillUsers")
const recuiterRouter = require("./recuiter")
const jobRouter = require("./job")
const jobApplyRouter = require("./jobApply")

router

    .use("/users", usersRouter)
    .use("/skill", skillRouter)
    .use("/work-experience", workExperienceRouter)
    .use("/portfolio", portfolioRouter)
    .use("/skill-users", skillUsersRouter)
    .use("/recuiter", recuiterRouter)
    .use("/job", jobRouter)
    .use("/job-apply", jobApplyRouter)

module.exports = router;
 