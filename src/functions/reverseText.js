module.exports = reverseText = (text) => {
  if (!text)
    throw new TypeError("MISSING_ARGUMENTS: Por favor, ingresa un texto.");
  if (typeof text !== "string") throw new TypeError("INVALID_TEXT: El texto debe ser una cadena.")

  return text.split("").reverse().join("");
};
