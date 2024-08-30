const Article = require("../../models/Article");
const uuid = require("uuid").v4;
const fs = require("fs").promises;
const appRoot = require("app-root-path");
const sharp = require("sharp");

exports.getAllArticles = async (req, res) => {
  const articles = await Article.find().select({
    _id: 1,
    image: 1,
    title: 1,
    introduction: 1,
  });
  if (articles.length == 0)
    return res.status(204).json({ message: "no article found !" });
  res.json(articles);
};

exports.latestArticles = async (req, res) => {
  const articles = await Article.find().limit(9).select({
    _id: 1,
    image: 1,
    title: 1,
  });
  if (articles == 0)
    return res.status(204).json({ message: "no article exist !" });
  res.json(articles);
};

exports.otherArticles = async (req, res) => {
  try {
    const { id } = req.query;
    if (!id) return res.status(400).json({ message: "id is required !" });
    const articles = await Article.find({ _id: { $ne: id } })
      .limit(4)
      .select({
        _id: 1,
        title: 1,
        image: 1,
      });
    if (articles == 0)
      return res.status(204).json({ message: "no article exist !" });
    res.json(articles);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getArticle = async (req, res) => {
  try {
    const { id } = req.query;

    if (!id) return res.status(400).json({ message: "id is required !" });

    const foundArticle = await Article.findById({ _id: id }).exec();
    if (!foundArticle)
      return res
        .status(404)
        .json({ message: " no article matched with this id !" });
    res.json(foundArticle);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.createArticle = async (req, res) => {
  try {
    const { title, introduction, description } = req.body;
    const image = req.files ? req.files.articleImage : null;
    if (image === null) {
      await Article.articleValidation(req.body);
      const newArticle = {
        image: "http://localhost:3500/uploads/articleImg/dambel2.png",
        title,
        introduction,
        description,
      };
      await Article.create(newArticle);
      res.status(201).json({ message: "new article created !" });
    } else {
      const imageName = `${uuid()}_${image.name}`;
      const uploadPath = `${appRoot}/public/uploads/articleImg/${imageName}`;
      const imageUrl = `http://localhost:3500/uploads/articleImg/${imageName}`;

      req.body = { ...req.body, image };

      await Article.articleValidation(req.body);

      await sharp(image.data)
        .resize({
          width: 800,
          height: 600,
          fit: "inside",
        })
        .jpeg({ quality: 20 })
        .toFile(uploadPath)
        .catch((err) => console.log(err));

      const newArticle = {
        image: imageUrl,
        title,
        introduction,
        description,
      };
      await Article.create(newArticle);

      res.status(201).json({ message: "new article created !" });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.updateArticle = async (req, res) => {
  try {
    await Article.articleValidation(req.body);
  } catch (err) {
    const errors = [];
    err.inner.forEach((e) => {
      errors.push({
        name: e.path,
        message: e.message,
      });
    });
    return res.status(400).json(errors);
  }

  try {
    const { id } = req.body;

    if (!id) return res.status(400).json({ message: "id is required !" });

    const { title, introduction, description } = req.body;
    const newImage = req.files ? req.files.articleImage : null;

    const article = await Article.findOne({ _id: id }).exec();

    if (!article)
      return res
        .status(404)
        .json({ message: "no article matched with this id (not found) !" });

    if (newImage != null) {
      const prevImgUrl = article.image;
      const parts = prevImgUrl.split("/");
      const prevImageName = parts
        .slice(parts.indexOf("articleImg") + 1)
        .join("/");
      if (prevImageName !== "dambel2.png")
        await fs.unlink(
          `${appRoot}/public/uploads/articleImg/${prevImageName}`
        );

      const imageName = `${uuid()}_${newImage.name}`;
      const uploadPath = `${appRoot}/public/uploads/articleImg/${imageName}`;
      const imageUrl = `http://localhost:3500/uploads/articleImg/${imageName}`;

      await sharp(newImage.data)
        .jpeg({ quality: 20 })
        .toFile(uploadPath)
        .catch((err) => console.log(err));

      article.image = imageUrl;
    }

    if (req.body?.title) article.title = title;
    if (req.body?.introduction) article.introduction = introduction;
    if (req.body?.description) article.description = description;

    await article.save();

    const updatedArticles = await Article.find();

    res.json({ message: "article updated", updatedArticles });
  } catch (err) {
    return res.status(500).json({ message: err });
  }
};

exports.deleteArticle = async (req, res) => {
  try {
    const { id } = req.body;
    if (!id) return res.status(400).json({ message: "id is required !" });

    const foundArticle = await Article.findOne({ _id: id }).exec();
    if (!foundArticle)
      return res
        .status(404)
        .json({ message: " no article mached with this id !" });
    const imageUrl = foundArticle.image;
    const parts = imageUrl.split("/");
    const imageName = parts.slice(parts.indexOf("articleImg") + 1).join("/");
    if (imageName !== "dambel2.png")
      await fs.unlink(`${appRoot}/public/uploads/articleImg/${imageName}`);

    await Article.deleteOne({ _id: id });

    const updatedArticles = await Article.find();
    if (updatedArticles.length == 0)
      return res.status(204).json({ message: "no article found !" });
    res.json({
      message: "article deleted !",
      updatedArticles,
    });
  } catch (err) {
    res.status(500).json({ message: err });
  }
};
