module.exports = (text, limit) => {
  if (!text || typeof text !== "string")
    throw new Error(
      "El texto debe ser especificado como una cadena de caracteres."
    );

  if (!limit || typeof limit !== "number")
    throw new Error("El límite debe ser especificado como un valor numérico.");

  return text.length > limit ? text.substring(0, limit) + "..." : text;
};
