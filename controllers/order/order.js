const Order = require("../../models/Order");
const uuid = require("uuid").v4;
const fs = require("fs").promises;
const appRoot = require("app-root-path");
const sharp = require("sharp");

exports.getOrders = async (req, res) => {
  const orders = await Order.find();
  if (this.getOrders.length == 0)
    return res.status(204).json({ message: "no order found !" });
  res.json(orders);
};

exports.createOrder = async (req, res) => {
  try {
    const namesArray = [];
    const files = req.files;

    for (const key in files) {
      if (Object.hasOwnProperty.call(files, key)) {
        const imageName = `${uuid()}_${files[key].name}`;
        const uploadPath = `${appRoot}/public/uploads/orderImg/${imageName}`;
        namesArray.push(uploadPath);
        await sharp(files[key].data)
          .jpeg({ quality: 20 })
          .toFile(uploadPath)
          .catch((err) => console.log(err));
      }
    }

    const [file1, file2, file3, file4] = namesArray;

    // req.body = { ...req.body, file1,file2,file3,file4 };

    // console.log(req.body);

    // await Order.orderValidation(req.body);

    const {
      firstname,
      lastname,
      mobile,
      email,
      weight,
      hight,
      history,
      illness,
      workout,
      goal,
      age,
      description,
    } = req.body;

    const newOrder = {
      firstname,
      lastname,
      age,
      mobile,
      email,
      weight,
      hight,
      goal,
      workout,
      illness,
      history,
      description,
      file1,
      file2,
      file3,
      file4,
    };
    await Order.create(newOrder);
    res.status(201).json({ message: "new order created !" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
