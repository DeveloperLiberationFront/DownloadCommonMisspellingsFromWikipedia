/**
 * If run directly, print a space separated list of all wikipedia misspelled
 * words.
 *
 * If required, return a promise for the words.
 */
var promiseHtml = require('promiseHtml'),
    Promise = require('promise'),
    _ = require('lodash'),
    cheerio = require('cheerio'),
    assert = require('assert');

var baseUrl =
    'https://en.wikipedia.org/wiki/Wikipedia:Lists_of_common_misspellings/';

var letters = _.map(new Array(26), function(value, index) {
  return String.fromCharCode('A'.charCodeAt(0) + index);
});

// multiple promises for arrays of words
var wordsPs = _.map(letters, function(letter) {
  return promiseHtml(baseUrl + letter)
  .then(function(html) {
    var $ = cheerio.load(html);
    return $('#mw-content-text ul').last().find('li')
    .map(function(i, elm) {
      var text = $(elm).text();
      var idx = text.indexOf(' ');
      assert.notStrictEqual(idx, -1);
      return text.substring(0, idx);
    })
    .toArray();
  });
});

var wordsP = Promise.all(wordsPs).then(_.flatten)

if (module.parent) {
  module.exports = wordsP;
} else {
  // console.log(letters.join(' '));
  wordsP.then(function(words) {
    return words.join(' ');
  })
  .then(console.log.bind(console));
}
