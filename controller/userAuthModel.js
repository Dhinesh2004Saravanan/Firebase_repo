const { default: mongoose, Mongoose } = require("mongoose");
const bcrypt = require("bcrypt");

const userAuthSchema = new mongoose.Schema({
  emailId: {
    type: String,
    lowercase: true,
  },
  password: {
    type: String,
  },

  createdAt: {
    type: Date,
    default: Date.now(),
  },
  username: {
    type: String,
  },
  userId: {
    type: String,
  },
  projects: {
    type: [String],
  },
});

const userProjAuthSchema = new mongoose.Schema({
  emailId: {
    type: String,
    lowercase: true,
  },
  password: {
    type: String,
  },
});

// creating a collection

userAuthSchema.pre("save", async function () {
  let userInfo = this;
  const salt = await bcrypt.genSalt(12);
  const hashedPass = await bcrypt.hash(this.password, salt);
  console.log(`hashed password is ${hashedPass}`);
  this.password = hashedPass;
  this.userId = this._id.valueOf().toString();
});

userAuthSchema.methods.comparePassword = async function (password) {
  let hashedpassword = this.password;

  let isSame = await bcrypt.compare(password, hashedpassword);

  return isSame;
};
const userAuthCollection = mongoose.model("userAuth", userAuthSchema);
module.exports = userAuthCollection;
