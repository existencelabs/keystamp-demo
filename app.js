// KeystampDemo
// =============================================================================
// Author : Jean-Philippe beaudet @s3r3nity
//
// app.js
//
// Keystamp-demo server
// =============================================================================

var express = require('express');
var http = require('http');
var path = require('path');
var express = require('express');
var bodyParser = require('body-parser');
var methodOverride = require('method-override');
var logger = require('morgan');
var mongoose = require('mongoose');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var request = require('request')

//main config
var app = express();
config = require('./config.js');
var BASE_URL = config.api
var server = require('http').createServer(app);
app.set('port', process.env.PORT || config.node_web_server_port);
app.set('views', path.join(__dirname + '/views'));
app.set('view engine', 'jade');
app.set('view options', { layout: true });

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(require('express-session')({
    secret: '88677fGG%6%$4',
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'app')));

// routes
app.use(function(req, res, next) {
    if(req.user) {
		if( !req.session.token || !req.session.uid || !req.session.token){
	Account.findOne({"username": req.user.username}, function(err, usr) {
		if (err || !usr){
			console.log('user could not be found')
		}
		req.session.uid = usr.uid
		req.session.xpub = usr.user_pub_key || 'xpub661MyMwAqRbcEyEs9gV77y1QamusXKgsbahZfALFuzyeYj6aFE1Pu6osg9VDdL3ysYXUf8RrQVhzFotuFDe4ZU9coQhUak88ore5T7JSGmF'
		req.session.save()
		console.log('session uid:'+req.session.uid )
		request.post({url: BASE_URL+'/auth',form: {app_secret:config.app_secret, app_id: config.app_id}},function (error, response, body) {
			console.log('app id '+config.app_id)
			config.token = JSON.parse(body).token
			req.session.token = JSON.parse(body).token
			req.session.save()
		console.log('session token:'+req.session.token )
		next()
		});
	})
}else{
		next()
	}
	}else{
		next()
	}
	
})
require('./routes/routes')(app);

console.log(("Express server listening on port " + app.get('port')));

//passport config
var Account = require('./models/account');
passport.use(new LocalStrategy(Account.authenticate()));
passport.serializeUser(Account.serializeUser());
passport.deserializeUser(Account.deserializeUser());

// mongoose
mongoose.connect('mongodb://'+config.node_web_server_host+ '/'+config.mongodb_database);

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function callback () {
  console.log("Keystamp-demo db started on : "+ config.mongodb_database+ ": "+config.node_web_server_host);
});

server.listen(config.node_web_server_port);

