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
var path = require('path');
var mime = require('mime');
var fs= require('fs')

exports.index = function (req, res) {
	console.log(req.session.usr)
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
		mess= []
		request.get(BASE_URL+'/get_my_documents/'+req.session.uid+'/?token='+req.session.token,function (error, response, body) {
			docs= JSON.parse(body).docs

		request.get(BASE_URL+'/get_my_tx/'+req.session.uid+'/?token='+req.session.token,function (error, response, body) {
			txs= JSON.parse(body).txs
		request.get(BASE_URL+'/get_notifications/'+req.session.uid+'/?token='+req.session.token,function (error, response, body) {
			notes= JSON.parse(body).notification
		request.get(BASE_URL+'/get_messages_inbox/'+req.session.uid+'/?token='+req.session.token,function (error, response, body) {
			mess= JSON.parse(body).mess
			console.log(body)
			var data = {
				title: "Keystamp.io",
				username: username,
				isAlreadyLoggedin:isAlreadyLoggedin,
				page: '/index',
				documents:  docs,
				txs:txs,
				xpub: req.session.xpub,
				notes: notes,
				mess: mess
			};
		res.render('index/index', data);
		});
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

exports.inbox= function (req, res) {
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
		mess= []
		request.get(BASE_URL+'/get_messages_sent/'+req.session.uid+'/?token='+req.session.token,function (error, response, body) {
			sent= JSON.parse(body).mess
			console.log(body)
		request.get(BASE_URL+'/get_my_tx/'+req.session.uid+'/?token='+req.session.token,function (error, response, body) {
			txs= JSON.parse(body).txs
		request.get(BASE_URL+'/get_notifications/'+req.session.uid+'/?token='+req.session.token,function (error, response, body) {
			notes= JSON.parse(body).notification
		request.get(BASE_URL+'/get_messages_inbox/'+req.session.uid+'/?token='+req.session.token,function (error, response, body) {
			mess= JSON.parse(body).mess
			console.log(body)
			var data = {
				title: "Keystamp.io",
				username: username,
				isAlreadyLoggedin:isAlreadyLoggedin,
				page: '/inbox',
				sent: sent,
				txs:txs,
				xpub: req.session.xpub,
				notes: notes,
				mess: mess
			};
		res.render('index/index', data);
		});
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
		res.render('index/login', data);
	}
};

exports.upload= function (req, res) {
	var path = req.body.path
	var username = "Not logged in";
	var isAlreadyLoggedin = false;
	var uid = null
	// if the user is logged in  so fetch the necessary data
	if(req.user) {
		username = req.user.username;
		isAlreadyLoggedin = true;
	if (req.body.key){
		request.post({url:BASE_URL+'/upload/'+req.session.uid+'/?token='+req.session.token, form:{
			path: path,
			key : key
			}},function (error, response, body) {
				res.redirect('/upload')
		})
	}else{
		request.post({url:BASE_URL+'/create_document/'+req.session.uid+'/?token='+req.session.token, form:{
		path: path
		}},function (error, response, body) {
			res.redirect('/upload')
		})
	}
	}else{
	res.redirect('/login')
	}
}
exports.upload_download= function (req, res) {
	var path = req.body.path
	var username = "Not logged in";
	var isAlreadyLoggedin = false;
	var uid = null
	// if the user is logged in  so fetch the necessary data
	if(req.user) {
		username = req.user.username;
		isAlreadyLoggedin = true;
	}
	request.post({url:BASE_URL+'/upload/'+req.session.uid+'/?token='+req.session.token, form:{
		path: path
		}},function (error, response, body) {
	var fs = require('fs')
	request.get('http://localhost/api/tmp/'+req.session.uid+'/newfile.dat',function (error, response, body) {
		console.log('request got : '+JSON.stringify(response))
	}).pipe(fs.createWriteStream('./public/tmp/message.dat'));
	
	
			var file = './public/tmp/message.dat';

			var filename = Date.now()+"_"+req.session.uid+'.dat';
			var mimetype = mime.lookup(file);

			res.setHeader('Content-disposition', 'attachment; filename=' + filename);
			res.setHeader('Content-type', mimetype);

			var filestream = fs.createReadStream(file);
			filestream.pipe(res);
			
	})
	
}
exports.sign = function (req, res) {
	console.log(req.session.usr)
	var username = "Not logged in";
	var isAlreadyLoggedin = false;
	var uid = null
	// if the user is logged in  so fetch the necessary data
	if(req.user) {
		username = req.user.username;
		isAlreadyLoggedin = true;
		notes =[]
		mess= []
		request.get(BASE_URL+'/get_notifications/'+req.session.uid+'/?token='+req.session.token,function (error, response, body) {
			notes= JSON.parse(body).notification
		request.get(BASE_URL+'/get_messages_inbox/'+req.session.uid+'/?token='+req.session.token,function (error, response, body) {
			mess= JSON.parse(body).mess
			console.log(body)
			var data = {
				title: "Keystamp.io",
				username: username,
				isAlreadyLoggedin:isAlreadyLoggedin,
				page: '/sign',
				xpub: req.session.xpub,
				notes: notes,
				mess: mess
			};
		res.render('index/index', data);
		});
	});
	}else{
		// else load default index
		var data = {
			title: "Keystamp.io",
			username: username,
			isAlreadyLoggedin:isAlreadyLoggedin,
			page: '/sign'
		};
		res.render('index/index', data);
	}
};
exports.verify = function (req, res) {
	console.log(req.session.usr)
	var username = "Not logged in";
	var isAlreadyLoggedin = false;
	var uid = null
	// if the user is logged in  so fetch the necessary data
	if(req.user) {
		username = req.user.username;
		isAlreadyLoggedin = true;
		notes =[]
		mess= []
		request.get(BASE_URL+'/get_notifications/'+req.session.uid+'/?token='+req.session.token,function (error, response, body) {
			notes= JSON.parse(body).notification
		request.get(BASE_URL+'/get_messages_inbox/'+req.session.uid+'/?token='+req.session.token,function (error, response, body) {
			mess= JSON.parse(body).mess
			console.log(body)
			var data = {
				title: "Keystamp.io",
				username: username,
				isAlreadyLoggedin:isAlreadyLoggedin,
				page: '/verify',
				xpub: req.session.xpub,
				notes: notes,
				mess: mess
			};
		res.render('index/index', data);
		});
	});
	}else{
		// else load default index
		var data = {
			title: "Keystamp.io",
			username: username,
			isAlreadyLoggedin:isAlreadyLoggedin,
			page: '/verify'
		};
		res.render('index/index', data);
	}
};
exports.encrypt = function (req, res) {
	console.log(req.session.usr)
	var username = "Not logged in";
	var isAlreadyLoggedin = false;
	var uid = null
	// if the user is logged in  so fetch the necessary data
	if(req.user) {
		username = req.user.username;
		isAlreadyLoggedin = true;
		notes =[]
		mess= []
		request.get(BASE_URL+'/get_notifications/'+req.session.uid+'/?token='+req.session.token,function (error, response, body) {
			notes= JSON.parse(body).notification
		request.get(BASE_URL+'/get_messages_inbox/'+req.session.uid+'/?token='+req.session.token,function (error, response, body) {
			mess= JSON.parse(body).mess
			console.log(body)
			var data = {
				title: "Keystamp.io",
				username: username,
				isAlreadyLoggedin:isAlreadyLoggedin,
				page: '/encrypt',
				xpub: req.session.xpub,
				notes: notes,
				mess: mess
			};
		res.render('index/index', data);
		});
	});
	}else{
		// else load default index
		var data = {
			title: "Keystamp.io",
			username: username,
			isAlreadyLoggedin:isAlreadyLoggedin,
			page: '/encrypt'
		};
		res.render('index/index', data);
	}
};
exports.upload_file = function (req, res) {
	console.log(req.session.usr)
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
		mess= []
		request.get(BASE_URL+'/get_my_documents/'+req.session.uid+'/?token='+req.session.token,function (error, response, body) {
			docs= JSON.parse(body).docs

		request.get(BASE_URL+'/get_my_tx/'+req.session.uid+'/?token='+req.session.token,function (error, response, body) {
			txs= JSON.parse(body).txs
		request.get(BASE_URL+'/get_notifications/'+req.session.uid+'/?token='+req.session.token,function (error, response, body) {
			notes= JSON.parse(body).notification
		request.get(BASE_URL+'/get_messages_inbox/'+req.session.uid+'/?token='+req.session.token,function (error, response, body) {
			mess= JSON.parse(body).mess
			console.log(body)
			var data = {
				title: "Keystamp.io",
				username: username,
				isAlreadyLoggedin:isAlreadyLoggedin,
				page: '/index',
				documents:  docs,
				txs:txs,
				xpub: req.session.xpub,
				notes: notes,
				mess: mess,
				upload: true
			};
		res.render('index/index', data);
		});
	});
		});
				});
    }else{
		// else load default index
		var data = {
			title: "Keystamp.io",
			username: username,
			isAlreadyLoggedin:isAlreadyLoggedin,
			page: '/login'
		};
		res.render('index/login', data);
	}
};
exports.keys= function (req, res) {
	console.log(req.session.usr)
	var username = "Not logged in";
	var isAlreadyLoggedin = false;
	var uid = null
	// if the user is logged in  so fetch the necessary data
	if(req.user) {
		username = req.user.username;
		isAlreadyLoggedin = true;
		notes =[]
		mess= []
		request.get(BASE_URL+'/get_notifications/'+req.session.uid+'/?token='+req.session.token,function (error, response, body) {
			notes= JSON.parse(body).notification
		request.get(BASE_URL+'/get_messages_inbox/'+req.session.uid+'/?token='+req.session.token,function (error, response, body) {
			mess= JSON.parse(body).mess
			console.log(body)
			var data = {
				title: "Keystamp.io",
				username: username,
				isAlreadyLoggedin:isAlreadyLoggedin,
				page: '/keys',
				xpub: req.session.xpub,
				notes: notes,
				mess: mess,
				result: '>> Result message will go here ... '
			};
		res.render('index/index', data);
		});
	});
	}else{
		// else load default index
		var data = {
			title: "Keystamp.io",
			username: username,
			isAlreadyLoggedin:isAlreadyLoggedin,
			page: '/keys',
			result: '>> Result message will go here ... '
		};
		res.render('index/index', data);
	}
};
exports.get_public_key= function (req, res) {
	console.log(req.session.usr)
	var username = "Not logged in";
	var isAlreadyLoggedin = false;
	var uid = null
	// if the user is logged in  so fetch the necessary data
	if(req.user) {
		username = req.user.username;
		isAlreadyLoggedin = true;
		notes =[]
		mess= []
		request.get(BASE_URL+'/get_notifications/'+req.session.uid+'/?token='+req.session.token,function (error, response, body) {
			notes= JSON.parse(body).notification
		request.get(BASE_URL+'/get_messages_inbox/'+req.session.uid+'/?token='+req.session.token,function (error, response, body) {
			mess= JSON.parse(body).mess
		request.get(BASE_URL+'/get_public_key',function (error, response, body) {
			var key= JSON.parse(body).xpub.x
			console.log(body)
			var data = {
				title: "Keystamp.io",
				username: username,
				isAlreadyLoggedin:isAlreadyLoggedin,
				page: '/keys',
				xpub: req.session.xpub,
				notes: notes,
				mess: mess,
				result: '>> publick key: '+key+' successfully created',
				key :key
			};
		res.render('index/index', data);
		});
	});
			});
	}else{
		request.get(BASE_URL+'/get_public_key',function (error, response, body) {

			var key= JSON.parse(body).xpub.x
		// else load default index
		var data = {
			title: "Keystamp.io",
			username: username,
			isAlreadyLoggedin:isAlreadyLoggedin,
			page: '/keys',
			result: '>> publick key: '+key+' successfully created',
			key :key
		};
		res.render('index/index', data);
	})
	}
};
exports.get_private_key= function (req, res) {
	console.log(req.session.usr)
	var username = "Not logged in";
	var isAlreadyLoggedin = false;
	var uid = null
	// if the user is logged in  so fetch the necessary data
	if(req.user) {
		username = req.user.username;
		isAlreadyLoggedin = true;
		notes =[]
		mess= []
		request.get(BASE_URL+'/get_notifications/'+req.session.uid+'/?token='+req.session.token,function (error, response, body) {
			notes= JSON.parse(body).notification
		request.get(BASE_URL+'/get_messages_inbox/'+req.session.uid+'/?token='+req.session.token,function (error, response, body) {
			mess= JSON.parse(body).mess
		request.get(BASE_URL+'/get_private_key',function (error, response, body) {
			var key= JSON.parse(body).xprv
			console.log(body)
			var data = {
				title: "Keystamp.io",
				username: username,
				isAlreadyLoggedin:isAlreadyLoggedin,
				page: '/keys',
				xpub: req.session.xpub,
				notes: notes,
				mess: mess,
				result: '>> Private key: '+key+' successfully created',
				key :key
			};
		res.render('index/index', data);
		});
	});
			});
	}else{
		request.get(BASE_URL+'/get_private_key',function (error, response, body) {
		var key= JSON.parse(body).xprv
		// else load default index
		var data = {
			title: "Keystamp.io",
			username: username,
			isAlreadyLoggedin:isAlreadyLoggedin,
			page: '/keys',
			result: '>> Private key: '+key+' successfully created',
			key :key
		};
		res.render('index/index', data);
	})
	}
};
exports.get_derived_key= function (req, res) {
	console.log(req.session.usr)
		var parent = req.body.parent 
		var current_path = req.body.path || '/m'
		var id = req.body.id || 0
	var username = "Not logged in";
	var isAlreadyLoggedin = false;
	var uid = null
	// if the user is logged in  so fetch the necessary data
	if(req.user) {
		username = req.user.username;
		isAlreadyLoggedin = true;
		notes =[]
		mess= []
		request.get(BASE_URL+'/get_notifications/'+req.session.uid+'/?token='+req.session.token,function (error, response, body) {
			notes= JSON.parse(body).notification
		request.get(BASE_URL+'/get_messages_inbox/'+req.session.uid+'/?token='+req.session.token,function (error, response, body) {
			mess= JSON.parse(body).mess
		request.post({url: BASE_URL+'/get_derived_key', form:{
			path : current_path,
			id:id,
			parent:parent
			}},function (error, response, body) {
			var key= JSON.parse(body).xprv
			var path = JSON.parse(body).path
			console.log(body)
			var data = {
				title: "Keystamp.io",
				username: username,
				isAlreadyLoggedin:isAlreadyLoggedin,
				page: '/keys',
				xpub: req.session.xpub,
				notes: notes,
				mess: mess,
				result: '>> New derived key: '+key+' created succesfully with path: '+path,
				key :key,
				path:path
			};
		res.render('index/index', data);
		});
	});
			});
	}else{
		request.post({url: BASE_URL+'/get_derived_key', form:{
			path : current_path,
			id:id,
			parent:parent
			}},function (error, response, body) {
			var key= JSON.parse(body).xprv
			var path = JSON.parse(body).path
		// else load default index
		var data = {
			title: "Keystamp.io",
			username: username,
			isAlreadyLoggedin:isAlreadyLoggedin,
			page: '/keys',
			result: '>> New derived key: '+key+' created succesfully with path: '+path,
			key :key,
			path:path
		};
		res.render('index/index', data);
	})
	}
};
