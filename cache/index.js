const cache = {};

const setCache = function (key, value) {
  cache[key] = value;
}

const getCache = function (key) {
  return cache[key];
}

const clear = function () {
  cache = {};
}

module.exports = {
  setCache,
  getCache,
  clear
}