const express = require("express");
const router = express.Router();
const {
  getAllArticles,
  getArticle,
  latestArticles,
  otherArticles,
  createArticle,
  updateArticle,
  deleteArticle,
} = require("../../controllers/article/articleController");

router.get("/getAll", getAllArticles);
router.get("/getOne", getArticle);
router.get("/latest", latestArticles);
router.get("/other", otherArticles);
router.post("/add", createArticle);
router.put("/update", updateArticle);
router.delete("/delete", deleteArticle);

module.exports = router;
