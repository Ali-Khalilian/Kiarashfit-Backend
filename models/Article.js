const mongoose = require("mongoose");
const Yup = require("yup");
const moment = require("jalali-moment");

const Schema = mongoose.Schema;

const ArticleSchema = new Schema({
  image: {
    type: String,
  },

  title: {
    type: String,
    required: [true, "required title"],
  },
  introduction: {
    type: String,
    required: [true, "required introduction"],
  },
  description: {
    type: String,
    required: [true, "required description"],
  },
  createAt : {
    type: String,
    default:() => moment().locale("fa").format("YYYY/M/D")
  }
});

const schema = Yup.object().shape({
  image: Yup.object().shape({
    name: Yup.string(),
    size: Yup.number().max(30000000, "img not allow over 3 meg"),
    mimetype: Yup.mixed().oneOf(
      ["image/jpeg", "image/png"],
      "only png and jpeg"
    ),
  }),
  title: Yup.string().required("title required"),
  introduction: Yup.string().required("introduction required"),
  description: Yup.string().required("description required"),
});

ArticleSchema.statics.articleValidation = function (body) {
  return schema.validate(body, { abortEarly: false });
};

module.exports = mongoose.model("Article", ArticleSchema);
