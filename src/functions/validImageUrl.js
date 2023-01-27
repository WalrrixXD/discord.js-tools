const regexp = /(https?:\/\/.*\.(?:png|jpe?g|gif|webp|svg|ico|tiff|bmp))/gi;

module.exports = validImageUrl = (url) => {
  if (!url)
    throw new TypeError("MISSING_ARGUMENTS: No haz especificado una url.");
  if (typeof url !== "string")
    throw new TypeError("INVALID_ARGUMENTS: La url debe ser una cadena.");

  return !regexp.test(url);
};
