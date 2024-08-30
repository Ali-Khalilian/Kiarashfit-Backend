const User = require("../models/User");
const bcrypt = require("bcrypt");

const handleNewUser = async (req, res) => {
  try {
    await User.userValidation(req.body);
  } catch (err) {
    return res.status(400).json({ message: err.message });
  }
  const {mobile , password } = req.body;
    
  // check duplicate in db
  const duplicate = await User.findOne({ mobile }).exec();

  if (duplicate) return res.status(409).json({message:"این شماره موبایل قبلا ثبت شده است"});
  try {
    //encrypt the password
    const hashPwd = await bcrypt.hash(password, 10);

    //create and save the new user
    const result = await User.create({
      ...req.body,
      password: hashPwd,
    });

    res.status(201).json({ message: `new user created !` , result});
  } catch (err) {
    res.status(500).json({ message: err });
  }
};

module.exports = { handleNewUser };
