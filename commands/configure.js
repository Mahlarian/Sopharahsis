const helpers = require('../helpers.js');
const Discord = require('discord.js');

module.exports = {
    name: 'configure',
    usage: 'configure <value> (newValue)',
    description: 'Modifies the server\'s settings for the bot.',
    cooldown: 3,
    guildOnly: true,
    requiredPermissions: ['MANAGE_GUILD'],
    async execute(msg, client, args) {
        client.db.get("SELECT id FROM `SERVER` WHERE discordID=?", msg.guild.id, function(err, row) {
            if (row == undefined) {
                helpers.addServerToDB(msg.guild.id,client.db);
                const commandObj = client.commands.get("config");
                commandObj.execute(msg, client, args);
            }
        });
        const lookupTerm = {
            "checkrolehierarchy": "checkRoleHierarchy",
            "muterole": "muteRole",
            "auditchannel": "auditChannel"
        };
        const outputLookupTerm = lookupTerm[args[0].toLowerCase];
        if (args.length == 1) {
            client.db.get("SELECT ? FROM `SERVER` WHERE discordID=?", outputLookupTerm, msg.guild.id, function (err, row) {
                if (row == undefined) {
                    const viewValueFailMsg = new Discord.MessageEmbed()
                        .setColor(client.config.color_red)
                        .setTitle("Failed to view value")
                        .setDescription(`There is no value to view for ${args[0]}.`);
                    return msg.channel.send(viewValueFailMsg);
                }
                const viewValueMsg = new Discord.MessageEmbed()
                    .setColor(client.config.color_green)
                    .setTitle("Server Configuration")
                    .setDescription(`Current value for \`${outputLookupTerm}\` is **${row}**`);
                return msg.channel.send(viewValueMsg);
            });
        }
        else if (args.length > 1) {
            //NOTE: IN THE FUTURE, A SWITCH CASE WILL BE IMPLEMENTED HERE TO MAKE THINGS MORE USER FRIENDLY, THIS WILL NOT CHECK FOR
            //FOR CORRECT VALUES, AND IN TURN, CAN REQUIRE A SERVER'S CONFIG TO BE RESET IF GIVEN A BAD VALUE
            //This command however is protected against SQL injection
            client.db.get("SELECT ? FROM `SERVER` WHERE discordID=?", outputLookupTerm, msg.guild.id, function (err, row){
                if (row == undefined) {
                    const editValueFailMsg = new Discord.MessageEmbed()
                        .setColor(client.config.color_red)
                        .setTitle("Failed to update value")
                        .setDescription(`There is no value to update for ${args[0]}.`);
                    return msg.channel.send(editValueFailMsg);
                }
                client.db.run("UPDATE `SERVER` SET (`?`)=? WHERE discordID=?", outputLookupTerm, args[1], msg.guild.id);
                const updateSuccessMsg = new Discord.MessageEmbed()
                    .setColor(client.config.color_green)
                    .setTitle("Value updated")
                    .setDescription(`Value for ${outputLookupTerm} has been successfully updated to ${args[1]}`);
                return msg.channel.send(updateSuccessMsg);
            });
        }
        else {
            const noCheckPreformed = new Discord.MessageEmbed()
                .setColor(client.config.color_error)
                .setTitle("Something went wrong...")
                .setDescription("You should not see this message **AT ALL**, if you do, it means something went very wrong, and you should report it using the `s!report` command.");
            return msg.channel.send(noCheckPreformed);
        }
    }
};