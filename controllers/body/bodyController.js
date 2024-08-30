const uuid = require("uuid").v4;
const fs = require("fs").promises;
const appRoot = require("app-root-path");
const sharp = require("sharp");
const Body = require("../../models/Body");

exports.getAllBodies = async (req, res) => {
  const bodies = await Body.find();
  if (bodies.length == 0)
    return res.status(204).json({ message: "no body found !" });
  res.json(bodies);
};

exports.getBody = async (req, res) => {
  try {
    const { id } = req.query;
    if (!id) return res.status(400).json({ message: "id is required !" });

    const foundBody = await Body.findById({ _id: id }).exec();
    if (!foundBody)
      return res
        .status(404)
        .json({ message: " no body mached with this id !" });
    res.json(foundBody);
  } catch (err) {
    res.status(500).json({ message: err });
  }
};

exports.createBody = async (req, res) => {
  try {
    const { title } = req.body;
    const image = req.files ? req.files.bodyImage : {};
    const imageName = `${uuid()}_${image.name}`;
    const uploadPath = `${appRoot}/public/uploads/bodyImg/${imageName}`;
    const imageUrl = `http://localhost:3500/uploads/bodyImg/${imageName}`;

    req.body = { ...req.body, image };

    await Body.bodyValidation(req.body);

    await sharp(image.data)
      .jpeg({ quality: 20 })
      .toFile(uploadPath)
      .catch((err) => console.log(err));

    const newBody = {
      image: imageUrl,
      title,
    };
    await Body.create(newBody);
    res.status(201).json({ message: "new body created !" });
  } catch (err) {
    console.log(err);

    res.status(500).json({ message: err });
  }
};

exports.updateBody = async (req, res) => {
  try {
    await Body.bodyValidation(req.body);

    const { id } = req.body;

    if (!id) return res.status(400).json({ message: "id is required !" });

    const { title } = req.body;
    const newImage = req.files ? req.files.bodyImage : null;

    const body = await Body.findOne({ _id: id }).exec();

    if (!body)
      return res
        .status(404)
        .json({ message: "no body matched with this id (not found) !" });

    if (newImage != null) {
      const prevImgUrl = body.image;
      const parts = prevImgUrl.split("/");
      const prevImageName = parts.slice(parts.indexOf("bodyImg") + 1).join("/");
      await fs.unlink(`${appRoot}/public/uploads/bodyImg/${prevImageName}`);

      const imageName = `${uuid()}_${newImage.name}`;
      const uploadPath = `${appRoot}/public/uploads/bodyImg/${imageName}`;
      const imageUrl = `http://localhost:3500/uploads/bodyImg/${imageName}`;

      await sharp(newImage.data)
        .jpeg({ quality: 20 })
        .toFile(uploadPath)
        .catch((err) => console.log(err));

      body.image = imageUrl;
    }

    if (req.body?.title) body.title = title;

    await body.save();

    const updatedBodies = await Body.find();

    res.json({ message: "body updated", updatedBodies });
  } catch (err) {
    return res.status(500).json({ message: err });
  }
};

exports.deleteBody = async (req, res) => {
  try {
    const { id } = req.body;
    if (!id) return res.status(400).json({ message: "id is required !" });

    const foundBody = await Body.findOne({ _id: id }).exec();
    if (!foundBody)
      return res
        .status(404)
        .json({ message: " no body mached with this id !" });
    const imageUrl = foundBody.image;
    const parts = imageUrl.split("/");
    const imageName = parts.slice(parts.indexOf("bodyImg") + 1).join("/");
    await fs.unlink(`${appRoot}/public/uploads/bodyImg/${imageName}`);
    await Body.deleteOne({ _id: id });

    const updatedBodies = await Body.find();
    if (updatedBodies.length == 0)
      return res.status(204).json({ message: "no body found !" });
    res.json({
      message: "body deleted !",
      updatedBodies,
    });
  } catch (err) {
    res.status(500).json({ message: err });
  }
};
