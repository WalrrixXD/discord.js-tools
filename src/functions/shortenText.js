module.exports = shortenText = (text, limit) => {
  if (!text)
    throw new TypeError("MISSING_ARGUMENTS: No ha ingresado un texto.");
  if (typeof text !== "string")
    throw new TypeError(
      "INVALID_TEXT: El texto debe ser especificado como una cadena de caracteres."
    );

  if (!limit)
    throw new TypeError("MISSING_ARGUMENTS: No ha especificado un límite.");
  if (isNaN(limit))
    throw new TypeError(
      "INVALID_ARGUMENTS: El límite debe ser especificado como un valor numérico."
    );

  return text.length > parseInt(limit)
    ? text.substring(0, parseInt(limit)) + "..."
    : text;
};
