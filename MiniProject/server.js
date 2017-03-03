var express        = require('express');
var app            = express();
var bodyParser     = require('body-parser');
var mongoose = require('mongoose');
var sessions = require('client-sessions');




var db = require('./config/db');
mongoose.connect(db.url) 

app.set ('view engine', 'ejs')


var port = process.env.PORT || 3000;

app.use(bodyParser.json());

// parse application/vnd.api+json as json
app.use(bodyParser.json({ type: 'application/vnd.api+json' }));

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));

app.use(sessions({
	cookieName:'session',
	secret: 'encryptionstring',
	duration: 30 * 60 * 1000,
	activeDuration: 5 * 60 * 1000

}));



// set the static files location /public/img will be /img for users
app.use(express.static(__dirname + '/public'));

var router = require('./app/routes');
app.use(router);



app.listen(port);

console.log('Magic happens on port ' + port);

// expose app
exports = module.exports = app;
