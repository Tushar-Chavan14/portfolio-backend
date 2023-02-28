import mongoose from "mongoose";
import validator from "validator";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const userSchema = mongoose.Schema({
  name: {
    type: String,
    trim: true,
    lowercase: true,
  },
  email: {
    type: String,
    unique: true,
    lowercase: true,
    required: true,
    trim: true,
    validate(value) {
      if (!validator.isEmail(value)) {
        throw new Error("please provide an valid email");
      }
    },
  },
  password: {
    type: String,
    trim: true,
    minLength: 8,
    required: true,
    validate(value) {
      if (value.toLowerCase().includes("password")) {
        throw new Error('the password phrase cannot be "password"');
      }
    },
  },
  tokens: [
    {
      token: {
        type: String,
        required: true,
      },
    },
  ],
});

userSchema.methods.genrateAuthToken = async function () {
  const token = jwt.sign({ _id: this._id.toString() }, process.env.JWTSECRET);

  this.tokens = this.tokens.concat({ token });
  this.save();

  return token;
};

userSchema.methods.toJSON = function () {
  const userOject = this.toObject();

  delete userOject.password;
  delete userOject.tokens;

  return userOject;
};

userSchema.statics.findByCredential = async (email, password) => {
  const user = await userModal.findOne({ email });

  if (!user) {
    throw new Error({ error: "no email found" });
  }

  const isMatchPass = await bcrypt.compare(password, user.password);

  if (!isMatchPass) {
    throw new Error({ error: "email nit found" });
  }

  return user;
};

userSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    this.password = await bcrypt.hash(this.password, 8);
  }

  next();
});

userSchema.pre("remove", async function (next) {
  await userModal.deleteOne({ _id: this._id });

  next();
});

export const userModal = mongoose.model("user", userSchema);
