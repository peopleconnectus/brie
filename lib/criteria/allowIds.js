module.exports = function () {
  const brie = this;
  const allow_ids = function (data_in = {}, idArr = []) {
    return (Array.isArray(idArr) && idArr.includes(data_in.id));
  };
  Object.assign(brie.criteria, { allowIDs: allow_ids });
};
