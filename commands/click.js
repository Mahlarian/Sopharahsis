const helpers = require('../helpers.js');
module.exports = {
	name: 'click',
	description: 'Click the clicker!',
	cooldown: 0,
	execute(msg, client, _) {
        client.db.get("SELECT clickPoints FROM USERS WHERE discordID=?", msg.author.id, function(err, row) {
            //const convertedString = util.inspect(row);
            if (row == undefined) {
                helpers.addUserToDB(msg.author.id, client.db);
                const commandObj = client.commands.get("click");
                commandObj.execute(msg, client, _);
            }
            else {
            const newValue = row.clickPoints += 1;
            client.db.run("UPDATE `USERS` SET (`clickPoints`)=? WHERE discordID=?", newValue, msg.author.id);
            msg.channel.send(newValue);
            }
        });
    }
};