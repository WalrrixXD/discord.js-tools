module.exports = limit = (text, limit) => {
  if (!text)
    throw new TypeError("MISSING_ARGUMENTS: No has ingresado un texto,");
  if (typeof text !== "string")
    throw new TypeError("INVALID_TEXT: El texto debe ser una cadena.");

  if (!limit)
    throw new TypeError("MISSING_ARGUMENTS: No haz especificado un límite.");
  if (isNaN(limit))
    throw new TypeError(
      "INVALID_ARGUMENTS: El límite debe ser un valor numérico."
    );

  return text.length > parseInt(limit)
    ? text.substring(0, parseInt(limit)) + "..."
    : text;
};
