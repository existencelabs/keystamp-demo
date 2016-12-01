// KeystampDemo
// =============================================================================
// Author : Jean-Philippe beaudet @s3r3nity
//
// ./routes/index.js
//
// Keystamp-demo routes index 
// =============================================================================

var mongoose = require('mongoose');
var request = require('request')
var BASE_URL = config.api
var Account = require('../models/account');
config = require('../config.js');


exports.index = function (req, res) {
	var username = "Not logged in";
	var isAlreadyLoggedin = false;
	var uid = null
	// if the user is logged in  so fetch the necessary data
	if(req.user) {
		username = req.user.username;
		isAlreadyLoggedin = true;
		docs= []
		txs=[]
		notes =[]
		request.get(BASE_URL+'/get_my_documents/'+req.session.uid+'/?token='+req.session.token,function (error, response, body) {
			docs= JSON.parse(body).docs

		request.get(BASE_URL+'/get_my_tx/'+req.session.uid+'/?token='+req.session.token,function (error, response, body) {
			txs= JSON.parse(body).txs
		request.get(BASE_URL+'/get_notifications/'+req.session.uid+'/?token='+req.session.token,function (error, response, body) {
			notes= JSON.parse(body).notification
			var data = {
				title: "Keystamp.io",
				username: username,
				isAlreadyLoggedin:isAlreadyLoggedin,
				page: '/index',
				documents:  docs,
				txs:txs,
				xpub: req.session.xpub,
				notes: notes
			};
		res.render('index/index', data);
		});
	});
		});
    }else{
		// else load default index
		var data = {
			title: "Keystamp.io",
			username: username,
			isAlreadyLoggedin:isAlreadyLoggedin,
			page: '/index',
			documents: [],
			txs: []
		};
		res.render('index/index', data);
	}
};
