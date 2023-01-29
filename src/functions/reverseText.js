module.exports = reverseText = (text) => {
  if (!text)
    throw new TypeError("MISSING_ARGUMENTS: Por favor, ingrese un texto.");
  if (typeof text !== "string")
    throw new TypeError(
      "INVALID_TEXT: El texto debe ser especificado como una cadena de caracteres."
    );

  return text.split("").reverse().join("");
};
