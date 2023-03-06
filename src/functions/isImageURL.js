const regexp = /(https?:\/\/.*\.(?:png|jpe?g|gif|webp|svg|ico|tiff|bmp))/gi;

module.exports = (url) => {
  if (!url || typeof url !== "string")
    throw new Error(
      "La dirección URL debe ser especificada como una cadena de caracteres válida."
    );

  return regexp.test(url);
};
