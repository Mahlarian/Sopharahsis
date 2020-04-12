const helpers = require('../helpers.js');
const Discord = require('discord.js');

module.exports = {
    name: 'mute',
    usage: 'mute <@user> (timeamount)(m/h/d/w/mo)',
	description: 'Mutes a user permanently or for a defined duration',
	cooldown: 7,
	async execute(msg, client, args) {
        client.db.get("SELECT muteRole FROM `SERVER` WHERE discordID=?", msg.guild.id, function(err, row){
            if (row == undefined) {
                const unconfiguredMsg = new Discord.MessageEmbed()
                    .setColor(client.config.color_red)
                    .setTitle("Mute has not been configured")
                    .setDescription("You need to first configure mute before using it!\n\nTo get started, use `s!configure mute`");
                return msg.channel.send(unconfiguredMsg);
            }
            if (args.length == 0){
                const noArguments = new Discord.MessageEmbed()
                    .setColor(client.config.color_red)
                    .setTitle("Incorrect Usage")
                    .setDescription("You need to tag a user to mute them.\n\n**Correct Usage:** `s!mute <@user> (timeamount)(m/h/d/w/mo)`");
                return msg.channel.send(noArguments);
            }
            const taggedUser = helpers.mentionToUserID(args[0]);
            if (taggedUser == null) {
                const nonExistentUser = new Discord.MessageEmbed()
                    .setColor(client.config.color_red)
                    .setTitle("Incorrect Usage")
                    .setDescription("You need to tag a user to ban them.\n\n**Correct Usage:** `s!mute <@user> (timeamount)(m/h/d/w/mo)`");
                return msg.channel.send(nonExistentUser);
            }
            if (taggedUser == msg.author.id){
                const authorAsTarget = new Discord.MessageEmbed()
                    .setColor(client.config.color_red)
                    .setTitle("Incorrect Usage")
                    .setDescription("You cannot mute yourself!\n\n**Correct Usage:** `s!mute <@user> (timeamount)(m/h/d/w/mo)`");
                return msg.channel.send(authorAsTarget);
            }
        });
	},
};