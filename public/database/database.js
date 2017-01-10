var mongoose = require('mongoose');
mongoose.connect("mongodb://127.0.0.1/201611node");
var UserSchema = new mongoose.Schema({
    username: {type:String,require:true},
    password: {type:String,require:true},
    email: String
},{collection:'user'});

var UserModel = mongoose.model('User', UserSchema);

module.exports = UserModel;

