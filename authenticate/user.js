const mongoose = require("mongoose")
const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  password: {type: String,required: true},
  key: {type: String,required: true},
  iv: {type: String,required: true},

});



module.exports = mongoose.model("users", userSchema);
