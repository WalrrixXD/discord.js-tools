const regexp = /(https?:\/\/.*\.(?:png|jpe?g|gif|webp|svg|ico|tiff|bmp))/gi;

module.exports = validateImageURL = (url) => {
  if (!url)
    throw new TypeError(
      "MISSING_ARGUMENTS: No ha ingresado una dirección URL."
    );
  if (typeof url !== "string")
    throw new TypeError(
      "INVALID_ARGUMENTS: La dirección URL debe ser especificada como una cadena de caracteres válida."
    );

  return !regexp.test(url);
};
