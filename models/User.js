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
  passwordHash: {
    type: String,
    require: true,
  },
});

UserSchema.set("toJSON", {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id;
    delete returnedObject._id;
    delete returnedObject.__v;

    delete returnedObject.passwordHash 
  },
});

const User = mongoose.model("User", UserSchema);

module.exports = User;
