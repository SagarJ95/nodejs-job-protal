const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const UserModel = new mongoose.Schema(
  {
    name: {
      type: "String",
      required: [true, "Name is Requierd"],
    },
    email: {
      type: "String",
      required: [true, "Email is required"],
      unique: [true, "This Email already exists"],
      validate: validator.isEmail,
    },
    password: {
      type: "String",
      required: "true",
      select: true,
    },
    location: {
      type: "String",
      default: "India",
    },
  },
  { timestamps: true }
);

//password bcrypt js package
UserModel.pre("save", async function () {
  if (!this.isModified) return;
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

//create method for compare password
UserModel.methods.ComparePassword = function (userPassword) {
  const isMatch = bcrypt.compare(userPassword, this.password);
  return isMatch;
};
//create method for JWT Token
UserModel.methods.createJWT = function () {
  return jwt.sign({ userId: this._id }, process.env.JWT_SEC, {
    expiresIn: "1d",
  });
};

module.exports = mongoose.model("user", UserModel);
