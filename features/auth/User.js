import { Schema, model } from "mongoose";

const userSchema = new Schema(
  {
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
  },
  {
    timestamps: true,
    toJSON: {
      transform: (doc, ret) => {
        delete ret.passWordHash;
        return ret;
      },
    },
  }
);

userSchema.index({ email: 1 }, { unique: true });

export default model("User", userSchema);
