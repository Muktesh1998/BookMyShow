const jwt = require("jsonwebtoken");

const validateJWTToken = (req, res, next) => {
  try {
    let token = req?.headers?.authorization?.split(" ")[1];
    if (!token) {
      // Fallback to cookie-based auth without cookie-parser
      const rawCookie = req.headers?.cookie || "";
      const cookieMap = Object.fromEntries(
        rawCookie.split(";").map((c) => {
          const idx = c.indexOf("=");
          if (idx === -1) return [c.trim(), ""];
          const k = c.slice(0, idx).trim();
          const v = decodeURIComponent(c.slice(idx + 1));
          return [k, v];
        })
      );
      token = cookieMap["bms_token"];
    }
    if (!token) throw new Error("Unauthorized");
    const decode = jwt.verify(token, process.env.SECRET_KEY);
    req.body = { email: decode?.email, userId: decode?.userId, ...req.body };
    next();
  } catch (error) {
    res.status(401);
    next(error);
  }
};

module.exports = {
  validateJWTToken,
};
