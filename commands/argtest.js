const helpers = require('../helpers.js');

module.exports = {
	name: 'argtest',
    description: 'succ',
	execute(message, _, args) {
        if (args.length == 0) {
            message.channel.send(message.author.id);
        }
        else {
            const taggedUser = helpers.mentionToUserID(args[0]);
            if (taggedUser == null) {
                message.channel.send("Argument is not user");
            }
            else {
                message.channel.send("User was tagged");
            }
        }
	},
};