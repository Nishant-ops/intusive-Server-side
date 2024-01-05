const express = require("express");
const {
  createUser,
  LoginUser,
  UpdateUsageTime,
  Logout,
} = require("../Controller/UserController");
const UserRouter = express.Router();
UserRouter.route("/register").post(createUser);
UserRouter.route("/login").post(LoginUser);
UserRouter.route("/usage").post(UpdateUsageTime);
UserRouter.route("/logout").post(Logout);

module.exports = UserRouter;
