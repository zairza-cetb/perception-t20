var mongoose = require("mongoose"),
    localMongoose = require("passport-local-mongoose");
//User Schema
const userSchema = new mongoose.Schema ({
    name: String,
    gender: String,
    password: String,
    phone: Number,
    college: String,
    events: [String]
  });

userSchema.plugin(localMongoose);

// SETUP DATABASE FOR REGISTRATION:
mongoose.connect("mongodb+srv://zairzacetb:arpanet123@cluster0-coz0t.mongodb.net/test?retryWrites=true&w=majority", {
  useNewUrlParser: true,
  useUnifiedTopology: true
});
mongoose.set('useNewUrlParser', true);
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);

module.exports = mongoose.model("User", userSchema);
