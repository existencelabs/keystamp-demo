// KeystampDemo
// =============================================================================
// Author : Jean-Philippe beaudet @s3r3nity
//
// ./routes/index.js
//
// Keystamp-demo main routes
// =============================================================================

var index = require('../routes/index');
var express = require('express');
var passport = require('passport');
var Account = require('../models/account');

module.exports = function (app) {

	//Main routes
	///////////////////////////
	app.get('/', index.index);
	app.get('/inbox', index.inbox);
	app.get('/sign', index.sign);
	app.get('/verify', index.verify);
	app.get('/encrypt', index.encrypt);
	app.get('/upload', index.upload_file);
	app.get('/keys', index.keys);
	app.post('/upload', index.upload);
	app.post('/upload_download', index.upload_download);
	// auth routes
	/////////////////////////////
	app.get('/login', function(req, res) {
	    res.render('index/login', {title:" Login" });
	});
	app.get('/register', function(req, res) {
	    res.render('index/register', {title:" Register" });
	});
	app.post('/register', function(req, res, next) {
      Account.register(new Account({ username : req.body.username }), req.body.password, function(err, account) {
        if (err) {
          return res.render("index/register", {info: "Sorry. That username already exists. Try again."});
        }

        passport.authenticate('local')(req, res, function () {
            req.session.save(function (err) {
               if (err) {
                    return next(err);
                }
				res.redirect('/'); 
           });
        });
   });
   });

	app.post('/login', passport.authenticate('local'), function(req, res, next) {
	    req.session.save(function (err) {
	        if (err) {
	            return next(err);
	        }
	        res.redirect('/');
	    });
	});

	app.get('/logout', function(req, res, next) {
      req.logout();
      req.session.save(function (err) {
        if (err) {
            return next(err);
        }
        res.redirect('/');
    });
    });	
	
	// error handlers
	/////////////////////////////////
	// catch 404 and forward to error handler
	app.use(function(req, res, next) {
	    var err = new Error('Not Found');
	    err.status = 404;
	    next(err);
	});
	
	// development error handler
	// will print stacktrace
	if (app.get('env') === 'development') {
	    app.use(function(err, req, res, next) {
	        res.status(err.status || 500);
	        res.render('index/error', {
	            message: err.message,
	            error: err
	        });
	    });
	}

	// production error handler
	// no stacktraces leaked to user
	app.use(function(err, req, res, next) {
	    res.status(err.status || 500);
	    res.render('index/error', {
	        message: err.message,
	        error: {}
	    });
	});
	
};
