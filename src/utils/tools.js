const Discord = require("discord.js");

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
        embed.setFooter({
          text: `Página ${page + 1} de ${embed.length}`,
        }),
      ],
      components: [buttons],
      fetchReply: option ? true : null,
    });
  },
};
