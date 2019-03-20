'use strict';

let express = require('express');
let shortid = require('shortid');
let mongoose = require('mongoose');
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true });
require('./urlModel');

let app = express();
let port = process.env.PORT || 3000;
let db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
	console.log('Connected to DB');
});
let Url = mongoose.model('urls');

app.use('/public', express.static(process.cwd() + '/public'));

app.get('/', function(req, res) {
	res.sendFile(process.cwd() + '/views/index.html');
});

app.get('/api/hello', function(req, res) {
	res.json({ greeting: 'hello API' });
});

app.get('/short/https://:url', async (req, res) => {
	Url.find({ userUrl: `https://${req.params.url}` }, (err, data) => {
		if (err) {
			console.log(err);
		} else if (data[0]) {
			res.send({ original: data[0].userUrl, shortUrl: data[0].shortUrl });
		} else {
			let hash = shortid.generate();
			let url = new Url({
				userUrl: `https://${req.params.url}`,
				shortUrl: hash
			});
			url.save();

			res.send({ original: `https://${req.params.url}`, shortUrl: hash });
		}
	});
});

app.get('/short/http://:url', async (req, res) => {
	Url.find({ userUrl: `http://${req.params.url}` }, (err, data) => {
		if (err) {
			console.error(err);
		} else if (data[0]) {
			res.send({ original: data[0].userUrl, shortUrl: data[0].shortUrl });
		} else {
			let hash = shortid.generate();
			let url = new Url({
				userUrl: `http://${req.params.url}`,
				shortUrl: hash
			});
			url.save();

			res.send({ original: `http://${req.params.url}`, shortUrl: hash });
		}
	});
});

app.get('/:url', (req, res) => {
	Url.find({ shortUrl: req.params.url }, (err, url) => {
		if (err) {
			console.error(err);
		}
		if (url.length && url[0].shortUrl === req.params.url) {
			res.redirect(url[0].userUrl);
		} else {
			res.send('invalid shortener, to shorten url visit /short/https://url');
		}
	});
});

app.listen(port, function() {
	console.log('Node.js listening ...');
});
