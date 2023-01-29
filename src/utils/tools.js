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

  sendMessage(message, option, embed, buttons, page) {
    return message.reply({
      allowedMentions: { repliedUser: false },
      embeds: [
        embed[0].setFooter({
          text: `Página ${page + 1} de ${embed.length}`,
        }),
      ],
      components: [buttons],
      fetchReply: option ? true : null,
    });
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
};
