var express = require('express');
var router = express.Router();
var superagent = require('superagent');
var cheerio = require('cheerio');
var eventproxy = require('eventproxy');
var url = require('url');
var async = require('async');

/* GET home page. */
router.get('/', function(req, res, next) {
	superagent.get('https://cnodejs.org/')
    .end(function (err, sres) {
      if (err) {
        return next(err);
      }
      var $ = cheerio.load(sres.text);
      var items = [];
      var topicUrls = [];
      $('#topic_list .topic_title').each(function (idx, element) {
        var $element = $(element);
        var href = url.resolve('https://cnodejs.org/', $element.attr('href'))
        topicUrls.push(href);
        // items.push({
        //   title: $element.attr('title'),
        //   href: $element.attr('href')
        // });
      });
      console.log(topicUrls);
      var concurrencyCount = 0;
      var fetchUrl = function (url, callback) {
        var delay = parseInt((Math.random() * 10000000) % 2000, 10);
        concurrencyCount++;
        console.log('现在的并发数是', concurrencyCount, '，正在抓取的是', url, '，耗时' + delay + '毫秒');
        setTimeout(function () {
          concurrencyCount--;
          callback(null, url + ' html content');
        }, delay);
      };

      async.mapLimit(topicUrls, 5, function (url, callback) {
        fetchUrl(url, callback);
      }, function (err, result) {
        console.log('final:');
        console.log(result);
      });

      res.send(topicUrls);
    });
  // res.render('index', { title: 'Express' });
});

module.exports = router;
