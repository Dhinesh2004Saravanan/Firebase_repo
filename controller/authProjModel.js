const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwtToken = require("jsonwebtoken");
const userProjAuthModel = new mongoose.Schema({
  emailId: {
    type: String,
  },
  password: {
    type: String,
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
  jwtToken: {
    type: String,
  },
});

userProjAuthModel.pre("save", async function () {
  let userInfo = this;
  const salt = await bcrypt.genSalt(12);
  const hashedPass = await bcrypt.hash(this.password, salt);
  console.log(`hashed password is ${hashedPass}`);
  this.password = hashedPass;
  this.userId = this._id.valueOf().toString();
  const token = jwtToken.sign({ emailId: userInfo.emailId }, "secretKey", {
    expiresIn: "24h",
  });

  this.jwtToken = token;
});
userProjAuthModel.methods.comparePassword = async function (password) {
  let hashedpassword = this.password;

  let isSame = await bcrypt.compare(password, hashedpassword);

  return isSame;
};

const userProjAuthCollection = mongoose.model(
  "authenticationDataProject",
  userProjAuthModel
);
module.exports = userProjAuthCollection;
