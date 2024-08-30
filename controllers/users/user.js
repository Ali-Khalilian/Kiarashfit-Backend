const User = require("../../models/User");
const Order = require("../../models/Order");
const uuid = require("uuid").v4;
const fs = require("fs").promises;
const appRoot = require("app-root-path");

exports.getUsers = async (req, res) => {
  const users = await User.find();
  if (users.length == 0)
    return res.status(204).json({ message: "no user found !" });
  res.json(users);
};

exports.getUser = async (req, res) => {
  const { id } = req.query;
  if (!id) res.status(400).json({ message: "id required !" });
  const user = await User.findById({ _id: id }).exec();
  if (user.length == 0)
    return res.status(204).json({ message: "no user found !" });
  res.json(user);
};

exports.deleteUser = async (req, res) => {
  try {
    const { id } = req.body;
    if (!id) return res.status(400).json({ message: "id is required !" });

    const foundUser = await User.findOne({ _id: id }).exec();
    if (!foundUser)
      return res
        .status(404)
        .json({ message: " no user mached with this id !" });

    await User.deleteOne({ _id: id });

    const updatedUsers = await User.find();
    if (updatedUsers.length == 0)
      return res.status(204).json({ message: "no user found !" });
    res.json({
      message: "user deleted !",
      updatedUsers,
    });
  } catch (err) {
    res.status(500).json({ message: err });
  }
};

exports.editUser = async (req, res) => {
  try {
    await User.userValidation(req.body);

    const { id, firstname, lastname, mobile, email, password } = req.body;

    if (!id) return res.status(400).json({ message: "id is required !" });

    const user = await User.findOne({ _id: id }).exec();

    if (!user)
      return res
        .status(404)
        .json({ message: "no user matched with this id (not found) !" });

    if (req.body?.firstname) user.firstname = firstname;
    if (req.body?.lastname) user.lastname = lastname;
    if (req.body?.mobile) user.mobile = mobile;
    if (req.body?.email) user.email = email;
    if (req.body?.password) user.password = password;

    await user.save();

    const updatedUsers = await User.find();

    res.json({ message: "user updated", updatedUsers });
  } catch (err) {
    return res.status(500).json({ message: err });
  }
};

exports.plan = async (req, res) => {
  try {
    const plan = req.files ? req.files.userPlan : null;
    const { mobile, orderId } = req.body;
    const user = await User.findOne({ mobile });
    if (!user) return res.status(404).json({ message: "no user found" });

    const planName = `${uuid()}_${plan.name}`;
    const uploadPath = `${appRoot}/public/uploads/userPlans/${planName}`;
    const planUrl = `http://localhost:3500/uploads/userPlans/${planName}`;

    if (plan) {
      await plan.mv(uploadPath);
      console.log("File uploaded successfully:", uploadPath);
    } else {
      console.log("No plan file uploaded.");
    }

    if (plan && user) user.plan = [...user.plan, planUrl];

    await user.save();

    const order = await Order.findOne({ _id: orderId }).exec();

    if (!order)
      return res
        .status(404)
        .json({ message: " no order mached with this id !" });

    const files = [order.file1, order.file2, order.file3, order.file4];

    for (const file of files) {
      if (file) {
        const parts = file.split("/");
        const imageName = parts.slice(parts.indexOf("orderImg") + 1).join("/");
        try {
          await fs.unlink(`${appRoot}/public/uploads/orderImg/${imageName}`);
          console.log(`Successfully deleted file: ${imageName}`);
        } catch (err) {
          console.error(`Error deleting file: ${imageName}`, err);
        }
      }
    }

    await Order.deleteOne({ _id: orderId });

    const updatedOrders = await Order.find();

    res
      .status(201)
      .json({ message: "برنامه با موفقیت ارسال شد", updatedOrders });
  } catch (err) {
    return res.status(500).json({ message: err });
  }
};
