const Discord = require("discord.js");
const { disabledButtons, sendMessage } = require("../utils/tools");

module.exports = class EmbedPages {
  constructor(options = {}) {
    if (!options.message)
      throw new TypeError(
        "MISSING_ARGUMENTS: Por favor proporcione un argumento de mensaje"
      );

    if (!options.itemsPerPage)
      throw new TypeError(
        "MISSING_ARGUMENTS: Por favor proporcione los elementos por página."
      );
    if (isNaN(options.itemsPerPage))
      throw new TypeError(
        "INVALID_ITEMS: Los elementos por página deben tener un valor numérico."
      );

    if (!options.slashCommands) options.slashCommands = false;
    if (typeof options.slashCommands !== "boolean")
      throw new TypeError(
        "INVALID_COMMAND_TYPE: El comando de barra debe ser un valor booleano. (true/false)"
      );

    if (!options.time) options.time = 180000;
    if (typeof options.time !== "number")
      throw new TypeError(
        "INVALID_TIME: la opción de tiempo debe ser un número en milisegundos"
      );
    if (options.time < 1000)
      throw new TypeError("INVALID_TIME: El tiempo mínimo es 1 segundo.");
    if (options.time > 8.64e7)
      throw new TypeError(
        "INVALID_TIME: El tiempo no debe superar las 24 horas"
      );

    if (!options.embed) options.embed = {};
    if (!options.embed.title) options.embed.title = "";
    if (typeof options.embed.title !== "string")
      throw new TypeError(
        "INVALID_TITLE: El título del embed debe ser una cadena."
      );
    if (!options.embed.description)
      throw new TypeError(
        "MISSING_ARGUMENTS: La descripción del embed no puede estar vacía."
      );
    if (!options.embed.thumbnail) options.embed.thumbnail = "";
    if (typeof options.embed.thumbnail !== "string")
      throw new TypeError(
        "INVALID_THUMBNAIL: La miniatura del embed debe ser una cadena."
      );
    if (!options.embed.color) options.embed.color = "#0000";
    if (typeof options.embed.color !== "string")
      throw new TypeError(
        "INVALID_COLOR: El color del embed debe ser una cadena."
      );

    if (!options.emojis) options.emojis = {};
    if (!options.emojis.back) options.emojis.back = "⬅";
    if (!options.emojis.start) options.emojis.start = "🏠";
    if (!options.emojis.advance) options.emojis.advance = "➡";

    this.message = options.message;
    this.itemsPerPage = parseInt(options.itemsPerPage);
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
  }

  async startPaging() {
    const buttons = new Discord.ActionRowBuilder().addComponents([
      new Discord.ButtonBuilder()
        .setEmoji(this.options.emojis.back)
        .setCustomId("back")
        .setStyle(3),

      new Discord.ButtonBuilder()
        .setEmoji(this.options.emojis.start)
        .setCustomId("start")
        .setStyle(4),

      new Discord.ButtonBuilder()
        .setEmoji(this.options.emojis.advance)
        .setCustomId("advance")
        .setStyle(3),
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
          content: "`❌`  No puedes usar los botones.",
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
          content: "`⏱`  El tiempo de uso de los botones ha expirado.",
          components: disabledButtons(embedPages.components),
        })
        .catch(() => null);
    });
  }
};
