const User = require("../models/User");
const jwt = require("jsonwebtoken");
require('dotenv').config();

const handleRefreshToken = async (req, res) => {
  const cookies = req.cookies;
  console.log(cookies);
  if (!cookies?.jwt) return res.sendStatus(401);
  const refreshToken = cookies.jwt;
  const foundUser = await User.findOne({ refreshToken }).exec();
  if (!foundUser) return res.sendStatus(403); //Forbidden

  // jwt verify validation
  jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, decoded) => {
    if (err || foundUser.mobile !== decoded.mobile)
      return res.sendStatus(403);
    const accessToken = jwt.sign(
      { userId: foundUser._id,
        role: foundUser.role  },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "10s" }
    );
   return res.json({ role:foundUser.role,accessToken });
  });
};

module.exports = { handleRefreshToken };
