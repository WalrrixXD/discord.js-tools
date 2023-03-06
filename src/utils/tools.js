const Discord = require("discord.js");
const validStyles = [
  Discord.ButtonStyle.Primary,
  Discord.ButtonStyle.Secondary,
  Discord.ButtonStyle.Success,
  Discord.ButtonStyle.Danger,
];

module.exports = {
  disabledButtons(button) {
    for (let i = 0; i < button.length; i++) {
      for (let j = 0; j < button[i].components.length; j++) {
        button[i].components[j] = Discord.ButtonBuilder.from(
          button[i].components[j]
        );

        button[i].components[j].setDisabled(true);
      }
    }

    return button;
  },

  async sendMessage(message, option, embed, buttons, page) {
    const messageOptions = {
      embeds: [
        embed[0].setFooter({
          text: `Página ${page + 1} de ${embed.length}`,
        }),
      ],
      components: [buttons],
    };

    if (option) {
      if (message.deferred) return await message.editReply(messageOptions);

      messageOptions.fetchReply = true;

      return message.reply(messageOptions);
    } else {
      messageOptions.allowedMentions = { repliedUser: false };

      return message.reply(messageOptions);
    }
  },

  validateButtonStyle(buttonStyle) {
    for (let i = 0; i < buttonStyle.length; i++) {
      if (
        !validStyles.includes(buttonStyle[i]) &&
        buttonStyle[i] !== "Primary" &&
        buttonStyle[i] !== "Secondary" &&
        buttonStyle[i] !== "Success" &&
        buttonStyle[i] !== "Danger"
      )
        return true;

      return false;
    }
  },

  EmbedPagesOptions: {
    message: Object,
    itemsPerPage: Number,
    slashCommands: Boolean,
    time: Number,
    embed: {
      author: {
        name: String,
        icon_url: String,
        url: String,
      },
      title: String,
      description: Array,
      thumbnail: undefined,
      color: undefined,
    },
    emojis: {
      back: String,
      start: String,
      advance: String,
    },
    styleButtons: Array,
    timeOverMessage: String,
    otherMessage: String,
  },
};
