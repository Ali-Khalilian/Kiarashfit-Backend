const mongoose = require("mongoose");
const Yup = require("yup");

const Schema = mongoose.Schema;

const BodySchema = new Schema({
  image: {
    type: String,
    // required: [true,"required image"],
  },

  title: {
    type: String,
    required: [true, "required title"],
  },
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
});

BodySchema.statics.bodyValidation = function (body) {
  return schema.validate(body, { abortEarly: false });
};

module.exports = mongoose.model("Body", BodySchema);
