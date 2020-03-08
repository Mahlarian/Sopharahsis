const Discord = require('discord.js');

module.exports = {
    name: 'invite',
    description: 'You shouldn\'t use this unless you\'ve discussed this with the bot\'s owner',
    cooldown: 3,
    requiredPermissions: [],
      async execute(message, client, __) {
          await message.channel.send('Fetching...');
          const inviteURL = await client.generateInvite(['SEND_MESSAGES', 'READ_MESSAGES']);
          const warning = new Discord.MessageEmbed()
                .setColor(client.config.color_red)
                .setTitle("🛑 Stop")
                .setDescription("This command is temporary and is used for testing purposes so testers can add bots to an empty server. Please be weary of which server you add this to. If you got this message trying to get the invite of another bot, ignore this message. Otherwise, please be aware that this version of the bot is unstable and may not work. \n\n**URL**: [Click me](" + inviteURL + ")");
            return message.channel.send(warning);
      }
  };