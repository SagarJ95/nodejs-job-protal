const JWT = require("jsonwebtoken");

const userAuth = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer")) {
    return res
      .status(401)
      .send({ error: "Missing or malformatted authentication header" });
  }
  const token = authHeader.split(" ")[1];

  try {
    const verifyToken = JWT.verify(token, process.env.JWT_SEC);
    req.user = { UserId: verifyToken.userId };
    next();
  } catch (error) {
    next("Auth Failed");
  }
};

module.exports = userAuth;
