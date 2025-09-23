const getPagination = function (page, size) {
  const offset = (page - 1) * size;
  const limit = size;
  return { offset, limit };
};
module.exports = { getPagination };
