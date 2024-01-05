const express = require("express");
const { uploadCSVFile } = require("../Controller/FileController");
const AdminRouter = express.Router();
const multer = require("multer");
const path = require("path");
const {
  getUsersCount,
  getUsersOnUsageTime,
} = require("../Controller/AdminController");
const { checkForAdminMiddleware } = require("../MiddleWare/AdminMiddleWare");
var storage = multer.diskStorage({
  destination: (req, file, callBack) => {
    callBack(null, "./public/files");
  },
  filename: (req, file, callBack) => {
    callBack(null, file.originalname);
  },
});

var upload = multer({
  storage: storage,
});

AdminRouter.route("/file").post(
  checkForAdminMiddleware,
  upload.single("file"),
  uploadCSVFile
);
AdminRouter.route("/countusers").get(checkForAdminMiddleware, getUsersCount);
AdminRouter.route("/getUserOnUsageTime").post(
  checkForAdminMiddleware,
  getUsersOnUsageTime
);

module.exports = AdminRouter;
