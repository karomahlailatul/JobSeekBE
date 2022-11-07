const express = require("express");
const router = express.Router();
const ControllerUsers = require("../controller/users");
const { protect } = require("../middlewares/auth");
const upload = require("../middlewares/upload");
// const { validateRegister,
//     validateLogin,
//     validateUpdateProfile,
//     validateChangeEmail,
//     validateChangePassword } = require('../middlewares/common')

const passport = require("passport");
const errorFrontEndUrl =  process.env.CALLBACK_ERROR_URL_FRONT_END

router

  .post("/register", ControllerUsers.registerAccount)
  .post("/register-user-recruiter", ControllerUsers.registerAccountWithRecruiter)
  .post("/login", ControllerUsers.loginAccount)
  .post("/refresh-token", ControllerUsers.refreshToken)
  .get("/profile", protect, ControllerUsers.profileAccount)
  .put("/profile", protect, upload.single("picture"), ControllerUsers.profileAccount)
  .delete("/profile", protect, ControllerUsers.profileAccount)
  .put("/profile/changeEmail", protect, ControllerUsers.changeEmail)
  .put("/profile/changePassword", protect, ControllerUsers.changePassword)
  .put("/profile/changePasswordAdmin/:id", protect, ControllerUsers.changePasswordAdmin)

  .get("/verify", ControllerUsers.VerifyAccount)

  .get('/auth/google', passport.authenticate('google', {  session: false,  scope: [ 'email', 'profile' ]}))
  .get('/auth/google/callback',  passport.authenticate( 'google', { failureRedirect:  errorFrontEndUrl , session: false,}),ControllerUsers.googleSign  )

module.exports = router;
