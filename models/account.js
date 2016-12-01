
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var passportLocalMongoose = require('passport-local-mongoose');

var Account = new Schema({
    username: String,
    password: String,
    uid: Number,
    token: {
		type:String,
		default: ""
	}
});

Account.plugin(passportLocalMongoose);

module.exports = mongoose.model('accounts', Account);
