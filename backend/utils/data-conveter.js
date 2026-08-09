const toCamelCase = obj => {
  if (Array.isArray(obj)) {
    return obj.map(v => toCamelCase(v));
  }

  if (obj !== null && obj.constructor === Object) {
    return Object.keys(obj).reduce((acc, key) => {
      const camelKey = key.replace(/_([a-z])/g, (_, char) =>
        char.toUpperCase(),
      );

      acc[camelKey] = toCamelCase(obj[key]);
      return acc;
    }, {});
  }

  return obj;
};
module.exports = {
  toCamelCase,
};
