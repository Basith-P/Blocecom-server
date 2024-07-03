import jwt from "jsonwebtoken";

import Token from "../features/auth/Token.js";
import User from "../features/auth/User.js";

const jwtErrorHandler = async (err, req, res, next) => {
  if (err.name === "UnauthorizedError") {
    if (!err.message.includes("jwt expired")) {
      return res.status(err.status).json({ error: err.message });
    }
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const accessToken = authHeader.split(" ")[1];
    let token = await Token.findOne({
      accessToken,
      refreshToken: { $exists: true },
    });
    if (!token) return res.status(401).json({ error: "Unauthorized" });

    const payload = jwt.verify(
      token.refreshToken,
      process.env.REFRESH_TOKEN_SECRET
    );
    const user = await User.findById(payload.id);
    if (!user) return res.status(401).json({ error: "Unauthorized" });

    const newAccessToken = jwt.sign(
      { id: user.id, isAdmin: user.isAdmin },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "1d" }
    );

    token.accessToken = newAccessToken;
    token.expiry = new Date(new Date().getTime() + 7 * 24 * 60 * 60 * 1000);
    await token.save();

    req.headers.authorization = `Bearer ${newAccessToken}`;
    res.set("Authorization", `Bearer ${newAccessToken}`);
    return next();
  }
  next();
};

export default jwtErrorHandler;
