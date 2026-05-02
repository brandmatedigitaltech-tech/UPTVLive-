const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    password: {
      type: String,
      required: true,
      select: false, // 🔥 SECURITY (hide password by default)
    },

    role: {
      type: String,
      enum: ["admin", "writer"],
      default: "writer",
    },

    // 🟢 ONLINE STATUS
    isOnline: {
      type: Boolean,
      default: false,
    },

    // 🕒 LAST LOGIN TIME
    lastLogin: {
      type: Date,
      default: null,
    },

    // 🕒 LAST LOGOUT TIME
    lastLogout: {
      type: Date,
      default: null,
    },

    // 🚫 BLOCK USER
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

// 🔥 REMOVE PASSWORD FROM RESPONSE
userSchema.methods.toJSON = function () {
  const obj = this.toObject();
  delete obj.password;
  return obj;
};

module.exports = mongoose.model("User", userSchema);