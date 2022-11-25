const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    require: true,
  },
  mail: {
    type: String,
    unique: true,
    require: true,
  },
  password: {
    type: String,
    require: true,
  },
});

UserSchema.requiredPaths()
UserSchema.path('mail').index({ unique: true });

const User = mongoose.model("User", UserSchema);

module.exports = User;
