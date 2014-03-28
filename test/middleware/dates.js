var re = /(\d{4})-(\d{2})-(\d{2})-(.+)/;

var year = exports.year = function(str) {
  return str.replace(re, '$1');
};

var month = exports.month = function(str) {
  return str.replace(re, '$2');
};

var day = exports.day = function(str) {
  return str.replace(re, '$3');
};

var slug = exports.postname = function(str) {
  return str.replace(re, '$4');
};

exports.toPost = function(str) {
  return str.replace(re, '$1/$2/$3/$4');
};