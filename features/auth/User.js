import { Schema, model } from "mongoose";

const userSchema = new Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    minlength: 3,
    maxlength: 50,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    maxlength: 254,
    // validate: {
    //   validator: (val) => {
    //     const emailRegex =
    //       /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    //     return emailRegex.test(val);
    //   },
    // },
  },
  passWordHash: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
    trim: true,
    maxlength: 15,
  },
  country: {
    type: String,
    trim: true,
    maxlength: 56,
  },
  city: {
    type: String,
    trim: true,
    maxlength: 56,
  },
  postalCode: {
    type: String,
    trim: true,
    maxlength: 56,
  },
  isAdmin: {
    type: Boolean,
    default: false,
  },
  resetPasswordToken: String,
  resetPasswordExpires: Date,
  wishlist: [
    {
      type: Schema.Types.ObjectId,
      ref: "Product",
    },
  ],
});

userSchema.index({ email: 1 });

export default model("User", userSchema);