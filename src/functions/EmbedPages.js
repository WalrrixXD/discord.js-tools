const Discord = require("discord.js");
const {
  disabledButtons,
  sendMessage,
  validateButtonStyle,
} = require("../utils/tools");

module.exports = class EmbedPages {
  constructor(options = {}) {
    if (!options.message)
      throw new TypeError(
        "MISSING_ARGUMENTS: Por favor, proporcione un argumento de mensaje válido."
      );

    if (!options.itemsPerPage)
      throw new TypeError(
        "MISSING_ARGUMENTS: Por favor, indique cuántos elementos desea mostrar por página."
      );
    if (typeof options.itemsPerPage !== "number")
      throw new TypeError(
        "INVALID_ITEMS: El número de elementos por página debe establecerse como un valor numérico."
      );

    if (!options.slashCommands) options.slashCommands = false;
    if (typeof options.slashCommands !== "boolean")
      throw new TypeError(
        "INVALID_COMMAND_TYPE: La opción para los comandos de barra debe ser establecida como un valor booleano (true/false)."
      );

    if (!options.time) options.time = 180000;
    if (typeof options.time !== "number")
      throw new TypeError(
        "INVALID_TIME: la opción de tiempo debe ser un número en milisegundos"
      );
    if (options.time < 10000)
      throw new TypeError(
        "INVALID_TIME: La duración mínima para establecer en un colector es de 10 segundos."
      );
    if (options.time > 900000)
      throw new TypeError(
        "INVALID_TIME: El tiempo establecido para el colector no debe exceder los 15 minutos."
      );

    if (!options.embed) options.embed = {};
    if (!options.embed.title) options.embed.title = "";
    if (typeof options.embed.title !== "string")
      throw new TypeError(
        "INVALID_TITLE: El título del embed debe ser una cadena de texto."
      );
    if (!options.embed.description)
      throw new TypeError(
        "MISSING_ARGUMENTS: La descripción del embed no puede ser nula o vacía."
      );
    if (!options.embed.thumbnail) options.embed.thumbnail = "";
    if (typeof options.embed.thumbnail !== "string")
      throw new TypeError(
        "INVALID_THUMBNAIL: La dirección URL de la miniatura del embed debe ser una cadena válida."
      );
    if (!options.embed.color) options.embed.color = "#0000";
    if (typeof options.embed.color !== "string")
      throw new TypeError(
        "INVALID_COLOR: El color del embed debe ser especificado como una cadena en formato hexadecimal"
      );

    if (!options.emojis) options.emojis = {};
    if (!options.emojis.back) options.emojis.back = "⬅";
    if (!options.emojis.start) options.emojis.start = "🏠";
    if (!options.emojis.advance) options.emojis.advance = "➡";

    if (!options.styleButtons)
      options.styleButtons = ["Success", "Danger", "Success"];
    if (!Array.isArray(options.styleButtons))
      throw new TypeError(
        "INVALID_FORM: Se debe proporcionar un arreglo con los nombres de los estilos de los botones."
      );
    if (options.styleButtons.length <= 0)
      throw new TypeError(
        "MISSING_ARGUMENTS: No se ha proporcionado ningún estilo para los botones."
      );
    if (options.styleButtons.length > 3)
      throw new TypeError(
        "LIMIT_EXCEEDED: Sólo se permiten proporcionar un máximo de 3 estilos válidos para los botones."
      );
    if (validateButtonStyle(options.styleButtons))
      throw new TypeError(
        "INVALID_BUTTONS_STYLE: La selección de estilos de botones proporcionada es inválida."
      );

    this.message = options.message;
    this.itemsPerPage = options.itemsPerPage;
    this.slashCommands = options.slashCommands;
    this.options = options;
    this.embeds = [];

    let divided = this.itemsPerPage;

    for (let i = 0; i < this.options.embed.description.length; i += divided) {
      let description = this.options.embed.description.slice(
        i,
        this.itemsPerPage
      );

      this.itemsPerPage += divided;

      let embed = new Discord.EmbedBuilder()
        .setTitle(this.options.embed.title || null)
        .setDescription(description.join(""))
        .setThumbnail(this.options.embed.thumbnail || null)
        .setColor(this.options.embed.color);

      this.embeds.push(embed);
    }

    this.startPaging();
  }

  async startPaging() {
    const buttons = new Discord.ActionRowBuilder().addComponents([
      new Discord.ButtonBuilder()
        .setEmoji(this.options.emojis.back)
        .setCustomId("back")
        .setStyle(this.options.styleButtons || "Success"),

      new Discord.ButtonBuilder()
        .setEmoji(this.options.emojis.start)
        .setCustomId("start")
        .setStyle(this.options.styleButtons || "Danger"),

      new Discord.ButtonBuilder()
        .setEmoji(this.options.emojis.advance)
        .setCustomId("advance")
        .setStyle(this.options.styleButtons || "Success"),
    ]);

    let currentPage = 0;

    if (this.embeds.length === 1) {
      return this.message.reply({
        allowedMentions: { repliedUser: false },
        embeds: [this.embeds[0]],
      });
    }

    const embedPages = await sendMessage(
      this.message,
      this.slashCommands,
      this.embeds,
      buttons,
      currentPage
    );

    const collector = embedPages.createMessageComponentCollector({
      filter: (i) => i?.isButton(),
      idle: this.options.time,
    });

    const user = this.message.author ? this.message.author : this.message.user;

    collector.on("collect", async (button) => {
      if (button.user.id !== user.id)
        return button.reply({
          content: "`❌`  No se le permite utilizar estos botones.",
          ephemeral: true,
        });

      switch (button.customId) {
        case "back":
          {
            collector.resetTimer();

            if (currentPage !== 0) {
              currentPage -= 1;

              await button?.deferUpdate();
              await embedPages
                .edit({
                  embeds: [
                    this.embeds[currentPage].setFooter({
                      text: `Página ${currentPage + 1} de ${
                        this.embeds.length
                      }`,
                    }),
                  ],
                  components: [embedPages.components[0]],
                })
                .catch((error) => {
                  console.error(error);
                });
            } else {
              currentPage = this.embeds.length - 1;

              await button?.deferUpdate();
              await embedPages
                .edit({
                  allowedMentions: { repliedUser: false },
                  embeds: [
                    this.embeds[currentPage].setFooter({
                      text: `Página ${currentPage + 1} de ${
                        this.embeds.length
                      }`,
                    }),
                  ],
                  components: [embedPages.components[0]],
                })
                .catch((error) => {
                  console.error(error);
                });
            }
          }
          break;

        case "start":
          {
            collector.resetTimer();

            currentPage = 0;

            await button?.deferUpdate();
            await embedPages.edit({
              embeds: [
                this.embeds[currentPage].setFooter({
                  text: `Página ${currentPage + 1} de ${this.embeds.length}`,
                }),
              ],
              components: [embedPages.components[0]],
            });
          }
          break;

        case "advance":
          {
            collector.resetTimer();

            if (currentPage < this.embeds.length - 1) {
              currentPage++;

              await button?.deferUpdate();
              await embedPages
                .edit({
                  embeds: [
                    this.embeds[currentPage].setFooter({
                      text: `Página ${currentPage + 1} de ${
                        this.embeds.length
                      }`,
                    }),
                  ],
                  components: [embedPages.components[0]],
                })
                .catch((error) => {
                  console.error(error);
                });
            } else {
              currentPage = 0;

              await button?.deferUpdate();
              await embedPages
                .edit({
                  embeds: [
                    this.embeds[currentPage].setFooter({
                      text: `Página ${currentPage + 1} de ${
                        this.embeds.length
                      }`,
                    }),
                  ],
                  components: [embedPages.components[0]],
                })
                .catch((error) => {
                  console.error(error);
                });
            }
          }
          break;

        default:
          break;
      }
    });

    collector.on("end", async () => {
      await embedPages
        .edit({
          content: "`⏱`  El plazo para utilizar estos botones ha vencido.",
          components: disabledButtons(embedPages.components),
        })
        .catch(() => null);
    });
  }
};
