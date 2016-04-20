var express = require('express');
var router = express.Router();
var des = require('../libs/des');
var mypara = require('../libs/mypara');
var request = require('superagent-bluebird-promise');
var config = require('../config');
var Memcached = require('memcached');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express Test' });
});

router.get('/decode/:query', function(req, res, next) {
	// var encode = des.encode(req.params.query, 'JiwLYG=-');
	var encode = req.params.query;
	var decode = des.decode(encode, 'JiwLYG=-');
	res.send(decode);
});

router.get('/encode', function(req, res, next) {
	var encode = des.encode('This is test.', 'JiwLYG=-');
	res.send(encode);
});

router.get('/myapi/:page/:pagesize', function(req, res, next) {
	var param = {
		'page' : req.params.page,
		'pageSize' : req.params.pagesize
	};
	var para = mypara.post('zhangying', param);
	var memcached = new Memcached('localhost:11211');
	var mem = memcached.get('list', function (err, data) {
		if(data) {
			res.send(data);
			return;
		}
	});
	request
		.post(config['zhangying']['url'] + 'referringDataV1')
		.send('p=' + encodeURIComponent(para))
		.end(function(err, data) {
			if(err) {
				return;
			}
			var result = des.decode(data.res.text, 'abcdefgh');
			result = JSON.parse(result);
			memcached.set('list', 3600, function (err) { /* stuff */ });
			res.send(result);
			// res.render('test', result.d);
		});
})

module.exports = router;
