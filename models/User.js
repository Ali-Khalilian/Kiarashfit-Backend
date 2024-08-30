const mongoose = require("mongoose");
const Yup = require("yup");

const Schema = mongoose.Schema;

const UserSchema = new Schema({
  firstname: {
    type: String,
    required: true,
  },
  lastname: {
    type: String,
    required: true,
  },
  mobile: {
    type: String,
    required: true,
  },
  email: {
    type: String,
  },
  plan:[],
  role: {
    type: String,
    enum: ['Admin', 'User', 'Editor'],
    default: 'User'
  },
  password: {
    type: String,
    required: true,
  },
  refreshToken: String,
});

const emailRegex = new RegExp(
  /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
);

const YupSchema = Yup.object().shape({
  firstname: Yup.string()
    .required("لطفا نام خود را وارد کنید")
    .min(3, "حداقل حرف مجاز 3 است")
    .max(30, "حداکثر 30 حرف مجاز است")
    .matches(
      /^[ابپتثجچهخدذرزسشصظطضعغفقک@-_.:گلمنوهیژئي\s0-9a-zA-Z]+$/,
      "فقط از حروف فارسی و لاتین و اعداد و @ : - _ . استفاده کنید"
    ),
  lastname: Yup.string()
    .required("لطفا نام خانوادگی خود را وارد کنید")
    .min(3, "حداقل حرف مجاز 3 است")
    .max(30, "حداکثر 30 حرف مجاز است")
    .matches(
      /^[ابپتثجچهخدذرزسشصظطضعغفقک@-_.:گلمنوهیژئي\s0-9a-zA-Z]+$/,
      "فقط از حروف فارسی و لاتین و اعداد و @ : - _ . استفاده کنید"
    ),
  mobile: Yup.string()
    .required("لطفا شماره همراه خود را وارد کنید")
    .matches(/^09[0-9]{9}$/, "معتبر  نیست / 123456789-09  "),

  email: Yup.string()
    .nullable()
    .trim()
    .test("is-email-or-empty", "فرمت ایمیل درست نیست", (value) => {
      if (value === null || value === undefined || value === "") {
        return true;
      }
      return Yup.string()
        .email("فرمت ایمیل درست نیست")
        .matches(emailRegex, "فرمت ایمیل درست نیست")
        .isValidSync(value);
    }),

  password: Yup.string()
    .required("لطفا رمز عبور خود را وارد کنید")
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})/,
      "حد اقل یک حرف بزرگ و یک حرف کوچک لاتین و اعداد و کارکترهای خاص استفاده کنید"
    ),
});

UserSchema.statics.userValidation = function (body) {
  return YupSchema.validate(body, { abortEarly: false });
};

module.exports = mongoose.model("User", UserSchema);
