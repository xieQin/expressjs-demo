var express = require('express');
var router = express.Router();
var superagent = require('superagent');
var cheerio = require('cheerio');
var eventproxy = require('eventproxy');
var url = require('url');

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

      res.send(topicUrls);
    });
  // res.render('index', { title: 'Express' });
});

module.exports = router;
