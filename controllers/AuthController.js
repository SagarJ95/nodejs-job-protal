const UserModel = require("../models/UserModel");

//Register Controller
const register = async (req, res, next) => {
  const { name, email, password } = req.body;

  if (!name) {
    /*return res
        .status(400)
        .send({ success: false, message: "Please Provide Name" });*/
    next("Please Provide Name");
  }

  if (!email) {
    /*return res
        .status(400)
        .send({ success: false, message: "Please Provide email" });*/
    next("Please Provide email");
  }

  if (!password) {
    /*return res
        .status(400)
        .send({ success: false, message: "Please Provide password" });*/
    next("Please Provide password");
  }

  const exitiuser = await UserModel.findOne({ email });

  if (exitiuser) {
    console.log("user");
    /*return res
        .status(200)
        .send({ success: false, message: "Email Id Already Register" });*/
    next("Email Id Already Register");
  }

  const createUser = await UserModel.create({ name, email, password });

  //token create
  const token = createUser.createJWT();

  return res
    .status(400)
    .send({ success: true, message: "User Create Successfully", token: token });
};

//login Controller
const loginController = async (req, res, next) => {
  const { email, password } = req.body;

  //email and password is requireed
  if (!email || !password) {
    next("Please Provide all Field informtion");
  }

  //hide password and find user into database using email is
  const user = await UserModel.findOne({ email }).select("+password");

  //check user in database or not if it is not then show user not found
  if (!user) {
    next("User Not Found");
  }

  //compare password with database (create method ComparePassword in UserModel)
  const isMatch = await user.ComparePassword(password);

  //create object for hide password in response
  user.password = undefined;

  //compare Password and match not found show error msg
  if (!isMatch) {
    next("User Password doesn't Match");
  }

  //create JWT Token
  const token = user.createJWT();

  //set cookies for token when user login
  const cookiesOption = {
    expires: new Date(
      Date.now() + process.env.JWT_EXPIRE_COOKIES_DAY * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
  };

  res.cookie("jwt", token, cookiesOption);

  res
    .status(200)
    .json({ sucess: true, message: "login successfully", user, token });
};

module.exports = {
  register,
  loginController,
};
