import jwt from "jsonwebtoken";

const userAuth = (req, res, next) => {
  let token = req.headers.token;
  if (!token && req.headers.authorization) {
    const authHeader = req.headers.authorization;
    if (authHeader.startsWith("Bearer ")) {
      token = authHeader.split(" ")[1];
    }
  }

  if (!token) {
    return res
      .status(401)
      .json({ success: false, message: "Not authorized. Login again" });
  }

  try {
    const tokenDecode = jwt.verify(token, process.env.JWT_SECRET);

    if (tokenDecode.id) {
      req.userId = tokenDecode.id; // <-- set on req, not req.body
      next();
    } else {
      return res.status(401).json({
        success: false,
        message: "Not authorized. Login again",
      });
    }
  } catch (error) {
    return res
      .status(401)
      .json({ success: false, message: "Not authorized. Login again" });
  }
};
export default userAuth;
