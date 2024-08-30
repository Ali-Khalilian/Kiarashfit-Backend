const User = require("../models/User");

const handleLogout = async (req, res) => {
  //on client  also delete the access token

  const cookies = req.cookies;
  if (!cookies?.jwt) return res.status(204); //No content
  const refreshToken = cookies.jwt;

  //is refreshtoken in db ?
  const foundUser = await User.findOne({ refreshToken }).exec();
  if (!foundUser) {
    res.clearCookie("jwt", { httpOnly: true, sameSite: "None", secure: true });
    return res.sendStatus(204);
  }

  //delete refreshtoken in db
  foundUser.refreshToken = "";
  const result = await foundUser.save();
  console.log(result);

  res.clearCookie("jwt", { httpOnly: true, sameSite: "None", secure: true });
  res.sendStatus(204);
};

module.exports = { handleLogout };
