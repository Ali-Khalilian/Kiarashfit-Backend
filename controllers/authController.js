const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

require("dotenv").config();

// res.set(
//   "Cache-Control",
//   "no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0"
// );

const handleLogin = async (req, res) => {
  const { mobile, password } = req.body;
  if (!mobile || !password)
    return res.status(401).json({ message: "required fields" });

  const foundUser = await User.findOne({ mobile }).exec();
  if (!foundUser) return res.sendStatus(401);
  //password validation
  const isMatch = await bcrypt.compare(password, foundUser.password);
  if (isMatch) {
    //create JWT
    const accessToken = jwt.sign(
      { userId: foundUser._id,   
        role: foundUser.role  },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "10s" }
    );
    const refreshToken = jwt.sign(
      { mobile: foundUser.mobile },
      process.env.REFRESH_TOKEN_SECRET,
      { expiresIn: "1d" }
    );
    //saving refreshtoken with current user
    foundUser.refreshToken = refreshToken;
     await foundUser.save();

    res.cookie("jwt", refreshToken, {
      httpOnly: true,
      // sameSite: "None",
      // secure: true,
      maxAge: 24 * 60 * 60 * 1000,
    });
    return res.json({ role:foundUser.role,accessToken });
  } else {
    res.sendStatus(401);
  }
};

module.exports = { handleLogin };
