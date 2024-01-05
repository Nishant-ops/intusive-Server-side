const UserModal = require("../Model/UserModel");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const validateEmail = (email) => {
  return email.match(
    /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
  );
};
const checkAdminEmail = (headers) => {
  if (headers.auth) {
    const decode = jwt.verify(headers.auth, "secret");
    if (decode.role == "admin") return true;
  }
  return false;
};
function uuidv4() {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
    var r = (Math.random() * 16) | 0,
      v = c == "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}
module.exports.createUser = async function createUser(req, res) {
  try {
    let data = req.body;
    if (data.role == "Admin") {
      if (!checkAdminEmail(req.headers)) {
        return res.status(400).json({
          message: "User is not allowed to create a Admin",
        });
      }
    }
    if (!validateEmail(data.email)) {
      return res.status(400).json({
        message: `Invalid email addres: ${data.email}`,
      });
    }
    if (data.password.length < 8) {
      return res.status(400).json({
        message: "Password should be altleast of 8 length",
      });
    }
    // console.log(data);
    let currentUser = await UserModal.exists({ email: data.email });
    console.log(currentUser);
    if (currentUser != null) {
      return res.status(400).json({
        message: `Email already exist:${data.email}`,
      });
    }
    data.totalActivityTime = 0;

    data.lastActivityTime = Date.now();
    data.id = uuidv4();
    console.log(data);

    const response = await UserModal.create(data);
    return res.status(200).json({
      message: "user added",
    });
  } catch (err) {
    return res.status(500).json({
      message: err,
    });
  }
};
module.exports.LoginUser = async function LoginUser(req, res) {
  try {
    const data = req.body;
    if (!validateEmail(data.email)) {
      return res.status(400).json({
        message: `Invalid email addres: ${data.email}`,
      });
    }
    if (data.password.length < 8) {
      return res.status(400).json({
        message: "Password should be altleast of 8 length",
      });
    }
    const user = await UserModal.findOne({ email: data.email });
    if (user == null) {
      return res.status(400).json({
        message: `No Email exist:${data.email}`,
      });
    }

    if (!user.validPassword(data.password)) {
      return res.status(400).json({
        message: "Incorrect Password",
      });
    }
    const JWT = jwt.sign(
      {
        email: user.email,
        role: user.role,
      },
      `${process.env.private_key}`,
      { expiresIn: "1h" }
    );
    await UserModal.updateOne(
      { email: data.email },
      { lastActivtyTime: Date.now() }
    );
    const response = {
      accessToken: JWT,
      role: user.role,
      email: user.email,
    };
    return res.status(200).json({
      data: response,
    });
  } catch (err) {
    return res.status(500).json({
      message: err,
    });
  }
};

module.exports.UpdateUsageTime = async function UpdateUsageTime(req, res) {
  try {
    const data = req.body;
    console.log(data);
    const user = await UserModal.findOneAndUpdate(
      { email: data.email },
      { $inc: { totalActivityTime: data.value }, lastActivtyTime: Date.now() }
    );
    return res.status(200).json({
      message: "updated",
    });
  } catch (err) {
    return res.status(500).json({
      message: err,
    });
  }
};
module.exports.Logout = async function Logout(req, res) {
  try {
    const data = req.body;
    await UserModal.updateOne(
      { email: data.email },
      { lastActivtyTime: Date.now() }
    );
  } catch (err) {
    return res.status(500).json({
      message: err,
    });
  }
};
