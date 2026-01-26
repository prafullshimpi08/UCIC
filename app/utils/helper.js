const toIntBoolean = (value) => {
  if (value === true || value === 1 || value === '1') return 1;
  return 0;
};

const getPagination = (page, size) => {
    const limit = size ? size : 10;
    const offset = page ? (page - 1) * limit : 0;
    return { limit, offset };
};

module.exports = {
  toIntBoolean,
  getPagination
};
