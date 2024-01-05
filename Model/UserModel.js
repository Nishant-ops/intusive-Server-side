const moongoose = require("mongoose");
const bcrypt = require("bcrypt");
const UserSchema = moongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    unique: true,
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  totalActivityTime: {
    type: Number,
  },
  lastActivityTime: {
    type: Date,
  },
  id: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    required: true,
  },
});

UserSchema.pre("save", async function save(next) {
  if (!this.isModified("password")) return next();
  try {
    this.password = bcrypt.hashSync(this.password, bcrypt.genSaltSync(8), null);
    return next();
  } catch (err) {
    return next(err);
  }
});

// checking if password is valid
UserSchema.methods.validPassword = function (password) {
  return bcrypt.compareSync(password, this.password);
};

const UserModal = moongoose.model("UserModal", UserSchema);
module.exports = UserModal;
