const mongoose = require("mongoose");
const Yup = require("yup");

const Schema = mongoose.Schema;

const OrderSchema = new Schema({
  firstname: {
    type: String,
    required: [true, "required firstname"],
  },
  lastname: {
    type: String,
    required: [true, "required lastname"],
  },
  age: {
    type: Number,
    required: [true, "required age"],
  },
  mobile: {
    type: String,
    required: [true, "required mobile"],
  },
  email: {
    type: String,
    required: [true, "required description"],
  },
  weight: {
    type: Number,
    required: [true, "required weight"],
  },
  hight: {
    type: Number,
    required: [true, "required hight"],
  },
  goal: {
    type: String,
    required: [true, "required goal"],
  },
  workout: {
    type: Number,
    required: [true, "required workout"],
  },
  illness: {
    type: String,
    required: [true, "required illness"],
  },
  history: {
    type: String,
    required: [true, "required history"],
  },
  description: {
    type: String,
    required: [true, "required description"],
  },
  file1: {
    type: String,
    required: [true, "required file1"],
  },
  file2: {
    type: String,
    required: [true, "required file2"],
  },
  file3: {
    type: String,
    required: [true, "required file3"],
  },
  file4: {
    type: String,
    required: [true, "required file4"],
  },
  // date: {
  //   type: Date,
  //   required: [true, "required date"],
  // },
});

// const schema = Yup.object().shape({
//   image: Yup.object().shape({
//     name: Yup.string().required("article img required"),
//     size: Yup.number().max(30000000, "img not allow over 3 meg"),
//     mimetype: Yup.mixed().oneOf(
//       ["image/jpeg", "image/png"],
//       "only png and jpeg"
//     ),
//   }),
//   firstname: Yup.string().required("firstname required"),
//   lastname: Yup.string().required("lastname required"),
//   mobile: Yup.string().required("mobile required"),
//   workout: Yup.number().required("workout required"),
//   weight: Yup.number().required("weight required"),
//   illness: Yup.string().required("illness required"),
//   history: Yup.string().required("history required"),
//   hight: Yup.number().required("hight required"),
//   goal: Yup.string().required("goal required"),
//   email: Yup.email().required("email required"),
//   age: Yup.number().required("age required"),
//   description: Yup.string().required("description required"),
// });

// OrderSchema.statics.orderValidation = function (order) {
//   return schema.validate(order, { abortEarly: false });
// };

module.exports = mongoose.model("Order", OrderSchema);
