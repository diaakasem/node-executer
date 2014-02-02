// Generated by CoffeeScript 1.6.3
(function() {
  var Say, jqueryify, jsdom, lang_selector, _;

  _ = require('lodash');

  jsdom = require('jsdom');

  Say = require('./say');

  jqueryify = function(url, callback) {
    return jsdom.env({
      url: url,
      scripts: ["http://code.jquery.com/jquery-2.0.2.min.js"],
      done: callback
    });
  };

  lang_selector = {
    en: "div#mp-tfa b>a"
  };

  exports.Wikipedia = (function() {
    function Wikipedia() {}

    Wikipedia.prototype.analyze = function(text) {
      var textArr, words;
      text = text.toLowerCase();
      textArr = text.split(' ');
      textArr = _.map(textArr, function(word) {
        return word = word.replace(/[,\.]/, '');
      });
      words = {};
      _.each(textArr, function(word) {
        if (word.length < 5) {
          return;
        }
        return words[word] = words[word] !== void 0 ? words[word] + 1 : 0;
      });
      words = _.map(words, function(value, key) {
        return {
          name: key,
          rank: value
        };
      });
      words = _.omit(words, ['this', 'that', 'south', 'north', 'east', 'west', 'southern', 'northen', 'between', 'after', 'before', 'then', 'there', 'here', 'against', 'their', 'other', 'where']);
      return words;
    };

    Wikipedia.prototype.best = function(dict, count) {
      if (count == null) {
        count = 10;
      }
      return _.chain(dict).sortBy('rank').reverse().first(count).value();
    };

    Wikipedia.prototype.keywords = function(text) {
      var keywords, ranks, words;
      words = this.analyze(text);
      ranks = this.best(words);
      keywords = _.map(ranks, 'name').join(', ');
      console.log("Keywords: " + keywords);
      return keywords;
    };

    Wikipedia.prototype.dailyArticle = function(lang, callback) {
      var base_url,
        _this = this;
      if (lang != null) {
        lang = "en";
      }
      base_url = "http://" + lang + ".wikipedia.org";
      return jqueryify(base_url, function(err, html) {
        var $, link, url;
        $ = html.$;
        link = $(lang_selector[lang]).first();
        if (link.length) {
          url = base_url + link.attr("href");
          return _this.scrape(url, callback);
        }
      });
    };

    Wikipedia.prototype.scrape = function(url, callback) {
      var _this = this;
      console.log("Wikipedia: " + url);
      return jqueryify(url, function(err, window) {
        var $, title;
        $ = window.$;
        title = $('#firstHeading').find('span').text();
        console.log("Title: " + title);
        return _this.getText(window, function(text) {
          var description, keywords;
          keywords = _this.keywords(text);
          description = _.first(text.split('. '), 3).join('. ');
          console.log("Description: " + description);
          return _this.getImages(window, function(images) {
            return callback(title, text, images);
          });
        });
      });
    };

    Wikipedia.prototype.getImages = function(window, callback) {
      var $, images, imagesFilter, map;
      $ = window.$;
      imagesFilter = function() {
        return $(this).attr('width') > 100;
      };
      map = function() {
        var arr, name;
        arr = $(this).attr('src').split('/');
        name = arr.splice(-1);
        return {
          name: arr[arr.length - 1] + "",
          url: ('http:' + arr.join('/')).replace(/\/thumb/, '')
        };
      };
      images = $('img[src*="//upload"]').filter(imagesFilter).map(map);
      return callback(images);
    };

    Wikipedia.prototype.getText = function(window, callback) {
      var $, all, text;
      $ = window.$;
      $.fn.reverse = [].reverse;
      all = $('#mw-content-text p:empty').first().prevAll('p, ul');
      all.find('li').text(function(i, text) {
        if (text.slice(-1) !== '.') {
          text = text + ". ";
        }
        return text;
      });
      text = all.reverse().text();
      text = text.replace(/\[\d+\]/g, '');
      text = text.replace(/\.([A-Z])/g, '. $1');
      return callback(text);
    };

    return Wikipedia;

  })();

}).call(this);

/*
//@ sourceMappingURL=wikipedia.map
*/
