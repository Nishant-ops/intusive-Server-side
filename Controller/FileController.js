const mongoose = require("mongoose");
const csv = require("csv-parser");
const fs = require("fs");
const multer = require("multer");
const UserModal = require("../Model/UserModel");

const { validateEmail, uuidv4 } = require("../utils");
module.exports.uploadCSVFile = async function uploadCSVFile(req, res) {
  try {
    fs.createReadStream(req.file.path)
      .pipe(csv({}))
      .on("data", async function (row) {
        const User = {
          name: row["name"],
          email: row["email"],
          gender: row["gender"],
          device: row["device"],
          country: row["country"],
          password: row["password"] ? row["password"] : "12345678",
          role: row["role"] ? row["role"] : "User",
          totalActivityTime: 0,
          lastActivityTime: Date.now(),
          id: uuidv4(),
        };

        if (validateEmail(User.email)) {
          let currentUser = await UserModal.exists({ email: User.email });
          if (currentUser == null) await UserModal.create(User);
        }
      });

    return res.status(200).json({
      message: "done",
    });
  } catch (err) {
    return res.status(500).json({
      message: err,
    });
  }
};
