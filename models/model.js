//mongodb url
const mongourl="mongodb+srv://zairzacetb:arpanet123@cluster0-coz0t.mongodb.net/test?retryWrites=true&w=majority";   //TODO:change the url while hosting

var mongoose = require("mongoose"),
    localMongoose = require("passport-local-mongoose");
//User Schema
const userSchema = new mongoose.Schema ({
    username: String,
    hash: String,
    salt: String,
    name: String,
    gender: String,
    password: String,
    phone: Number,
    college: String,
    events: [Number],
    paymentStatus: { type: String, default: 'unpaid' }
  });

userSchema.plugin(localMongoose);

// SETUP DATABASE FOR REGISTRATION:
mongoose.connect(mongourl, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});
mongoose.set('useNewUrlParser', true);
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);

module.exports = mongoose.model("User", userSchema);
