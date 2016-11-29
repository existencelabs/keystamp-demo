// KeystampDemo
// =============================================================================
// Author : Jean-Philippe beaudet @s3r3nity
//
// ./routes/index.js
//
// Keystamp-demo routes index 
// =============================================================================

var mongoose = require('mongoose');


exports.index = function (req, res) {
	var username = "Not logged in";
	var isAlreadyLoggedin = false;
	// if the user is logged in 
    if(req.user) {
    	username = req.user.username;
    	isAlreadyLoggedin = true;
    }
    var data = {
        title: "Keystamp.io",
        username: username,
        isAlreadyLoggedin:isAlreadyLoggedin,
        page: '/index'
    };
    res.render('index/index', data);

};
