import jwt from "jsonwebtoken";

const Authenticate = (handler) => async (req, res) => {
  const token = req.headers["auth-token"];
  try {
    const userInfo = jwt.verify(token, process.env.SECRET_KEY);
    req.user = userInfo.user;
    return handler(req, res);
  } catch (error) {
    res.status(500).json({ error });
    return handler(req, res);
  }
};

export default Authenticate;
