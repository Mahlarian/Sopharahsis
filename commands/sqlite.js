const helpers = require('../helpers.js');
module.exports = {
    name: 'sqlite',
    description: '-',
    cooldown: 0,
    async execute(msg, client, _) {
        client.db.run("SELECT `*` FROM `USERS` WHERE discordID=?", msg.author.id, function(err, row) {
            if (row == undefined) {
                msg.channel.send("You do not exist... adding you.");
                helpers.addUserToDB(msg.author.id, client.db);
                const commandObj = client.commands.get("sqlite");
                commandObj.execute(msg, client, _);
            }
            else {
                msg.channel.send("Data logged to console");
                console.log(row);
            }
        });
    }
};