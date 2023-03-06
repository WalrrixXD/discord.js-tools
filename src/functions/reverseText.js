module.exports = (text) => {
  if (!text || typeof text !== "string")
    throw new Error(
      "El texto debe ser especificado como una cadena de caracteres."
    );

  return text.split("").reverse().join("");
};
