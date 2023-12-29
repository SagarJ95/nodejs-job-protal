const mongoose = require("mongoose");

const jobModels = new mongoose.Schema(
  {
    company: {
      type: String,
      required: [true, "Company name is required"],
    },
    position: {
      type: "string",
      required: [true, "Position is required"],
      minlegnth: 1,
    },
    status: {
      type: "String",
      enum: ["pending", "interview", "reject"],
      default: "pending",
    },
    workType: {
      type: "String",
      enum: ["fullTime", "partTime", "remote"],
      default: "fullTime",
    },
    worklocation: {
      type: "String",
      enum: ["Mumbai", "delhi", "Other"],
      default: "Mumbai",
    },
    createdBy: {
      type: mongoose.Types.ObjectId,
      ref: "user",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("job", jobModels);
