//mongodb url
const mongourl="mongodb+srv://perceptioncet:Perceptiocet20@perception-erq0s.mongodb.net/test?retryWrites=true&w=majority";   //TODO:change the url while hosting

var mongoose = require("mongoose"),
    localMongoose = require("passport-local-mongoose");
//User Schema
const userSchema = new mongoose.Schema ({
    uid: String,
    username: String,
    hash: String,
    salt: String,
    name: String,
    gender: String,
    password: String,
    phone: Number,
    college: String,
    events: [Number]
  });

userSchema.plugin(localMongoose);

var CounterSchema = mongoose.Schema({
  _id: {type: String, required: true},
  seq: { type: Number, default: 0 }
});
var counter = mongoose.model('counter', CounterSchema);

userSchema.pre('save', function(next) {
  if(!this.isNew) return next();
  var doc = this;
  counter.findOneAndUpdate({
    _id: 'entityId'
  }, {
    $inc: {
      seq: 1
    }
  }, {
    new: true,
    upsert: true,
  }, function(error, counter)   {
      if(error)
        return next(error);

      doc.uid = `P${counter.seq+999}`;
      console.log('saving user id: ', doc.uid);
      next();
    });
});

// SETUP DATABASE FOR REGISTRATION:
mongoose.connect(mongourl, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});
mongoose.set('useNewUrlParser', true);
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);

module.exports = mongoose.model("User", userSchema);
