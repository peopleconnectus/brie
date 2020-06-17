module.exports = function () {
  const brie = this;
  const always = function (data_in, val) {
    return val;
  };
  Object.assign(brie.criteria, { always: always });
};
