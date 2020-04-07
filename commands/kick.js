const helpers = require('../helpers.js');
const Discord = require('discord.js');

module.exports = {
    name: 'kick',
    usage: 'kick <@user> (reason)',
    description: 'Kicks the user, with optional reason',
    cooldown: 3,
    guildOnly: true,
    requiredPermissions: ['KICK_MEMBERS'],
    botPermissions: ['KICK_MEMBERS'],
    async execute(message, client, args) {
        if (args.length == 0) {
            const noArguments = new Discord.MessageEmbed()
                .setColor(client.config.color_red)
                .setTitle("Incorrect Usage")
                .setDescription("You need to tag a user to kick them.\n\n**Correct Usage:** `s!kick <@user> (reason)`");
            return message.channel.send(noArguments);
        }
        const taggedUser = helpers.mentionToUserID(args[0]);
        if (taggedUser == null) {
            const nonExistentUser = new Discord.MessageEmbed()
                .setColor(client.config.color_red)
                .setTitle("Incorrect Usage")
                .setDescription("You need to tag a user to kick them.\n\n**Correct Usage:** `s!kick <@user> (reason)`");
            return message.channel.send(nonExistentUser);
        }
        if (taggedUser == message.author.id){
            const authorAsTarget = new Discord.MessageEmbed()
                .setColor(client.config.color_red)
                .setTitle("Invalid user")
                .setDescription("You cannot kick yourself!");
            return message.channel.send(authorAsTarget);
        }
        const targetObject = await message.guild.members.fetch(taggedUser);
        try {
            const displayReason = args.length > 1 ? args.slice(1).join(" ") : "No reason provided";
            const reason = `Kicked by ${message.author.tag} : ${displayReason}`;

            await targetObject.kick(reason);
            const success = new Discord.MessageEmbed()
                .setColor(client.config.color_green)
                .setTitle("Success")
                .setDescription(`User ${targetObject.user.username} has been kicked from the server.`)
                .addField("Reason:", displayReason)
                .setTimestamp();
            return message.channel.send(success);
        } catch (err) {
            if (err instanceof Discord.DiscordAPIError){
                if (err.code == 50013){
                const higherRoleThanBot = new Discord.MessageEmbed()
                    .setColor(client.config.color_red)
                    .setTitle("Unable to kick user")
                    .setDescription("I'm unable to kick that user, as their role is higher than mine.");
                return message.channel.send(higherRoleThanBot);
                }
            }
            else {
                console.log(`An issue has occurred while running s!kick\n ${err}`);
                const unknownErrorMsg = new Discord.MessageEmbed()
                    .setColor(client.config.color_red)
                    .setTitle("Unknown error occurred")
                    .setDescription("An unknown issue has occurred and that user couldn't be kicked. This error has been logged.");
                return message.channel.send(unknownErrorMsg);
            }
        }
    },
};