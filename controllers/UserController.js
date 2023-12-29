const UserModel = require("../models/UserModel");

const userList = async (req, res, next) => {
  const { name, email, lastname, location } = req.body;

  if (!name || !email || !lastname || !location) {
    next("Please fill All the Fields");
  }

  const user = await UserModel.findOne({ _id: req.user.UserId });
  user.name = req.body.name;
  user.email = req.body.email;
  user.lastname = req.body.lastname;
  user.location = req.body.location;

  await user.save();
  const token = await user.createJWT();

  return res.status(200).json({
    success: true,
    user,
    token,
  });
};

module.exports = userList;
