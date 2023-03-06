## 🛠️ utilities-djs

```

Funciones útiles para discord.js V14

```

## Paginas en embed

```js
const { EmbedPages } = require("discord.js-tools"); //Importamos la función en nuestro archivo.

let number = 1;

const displayRoles = interaction.guild.roles.cache
  .sort((a, b) => b.position - a.position)
  .map((roles) => `\`${number++}\` ${roles.toString()}\n`)
  .slice(0, -1);

new EmbedPages({
  message: interaction, // Se proporciona el parámetro de interacción o mensaje.
  itemsPerPage: 10, // Establecemos la cantidad de elementos a mostrar por página.
  slashCommands: true, // Para habilitar los comandos de barra (SlashCommands), se debe llamar a la propiedad correspondiente (por defecto se encuentra deshabilitado).
  time: 300000, // Se establece un límite temporal (en milisegundos) para el uso de las páginas (opcional)
  embed: {
    // Creamos un embed.
    author: {
      // Establecemos un autor al embed (opcional).
      name: `${interaction.user.username}`, // Nombre del author
      icon_url: interaction.user.displayAvatarURL(), // Icono del autor (opcional)
      url: "https://www.example.com/", // URL del autor (opcional)
    },
    title: "Paginas - Embed", // El título para el embed (opcional).
    description: displayRoles, // Utilizamos la variable 'displayRoles' previamente declarada.
    thumbnail: interaction.guild.iconURL(), // Una miniatura para nuestro embed (opcional).
    color: "DarkRed", // Un color para el embed (opcional).
  },
  emojis: {
    // Personalizamos los emojis de los botones en el embed (opcional).
    back: "⬅",
    start: "🏠",
    advance: "➡",
  },
  styleButtons: ["Success", "Danger", "Success"], // Le pasamos un estilo válido a los 3 botones (opcional)
  timeOver: "El tiempo de los botones ha expirado.", // Se proporciona un mensaje cuando el tiempo de uso de los botones haya vencido (opcional).
  otherMessage: "No puedes usar los botones.", // Se proporciona un mensaje en caso de que un usuario diferente al autor original intente usar los botones (opcional).
});
```

## Texto en reversa

```js
const { reverseText } = require("discord.js-tools"); //Importamos la función en nuestro archivo.

const text = "Este texto se pondrá en reversa.";

console.log(reverseText(text)); //Invocamos la función utilizando la variable 'text' que contiene el texto deseado

//Output: ".asrever ne árdnop es otxet etsE"
```

## Acortar un texto

```js
const { shortenText } = require("discord.js-tools"); //Importamos la función en nuestro archivo.

const text = "Hola esto es un ejemplo."; //Ingresamos el texto a acortar.
const limit = 22; //Se establece la longitud máxima de caracteres para el texto a visualizar

console.log(shortenText(text, limit)); //Invocamos nuestra función proporcionando las variables necesarias.

//Output: "Hola esto es un ejempl..."
```

## Validar la URL de una imagen

```js
const { isImageURL } = require("discord.js-tools"); //Importamos la función en nuestro archivo.

const url = "https://example.com/image.jpg"; //URL a validar.

//Pasamos la URL que deseamos validar.
if (isImageURL(url)) {
  console.log("La URL es una imagen.");
} else {
  console.log("La URL no es una imagen.");
}

//La función devolverá 'true' si la URL es una imagen y 'false' si no lo es.
```
