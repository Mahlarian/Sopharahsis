const Discord = require('discord.js');
const client = new Discord.Client();
const config = require('./config.json');
const fs = require('fs');
client.commands = new Discord.Collection();
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

client.once('ready', () => {
	console.log('Ready!');
});

client.login(config.token);

for (const file of commandFiles) {
	const command = require(`./commands/${file}`);

	// set a new item in the Collection
	// with the key as the command name and the value as the exported module
	client.commands.set(command.name, command);
}

client.on('message', async message => {
	if (!message.content.startsWith(config.prefix) || message.author.bot) return;

	const args = message.content.slice(config.prefix.length).split(/ +/);
	const command = args.shift().toLowerCase();

	const commandObj = client.commands.get(command);
	if (commandObj.requiredPermissions && !message.member.hasPermission(commandObj.requiredPermissions)) return invalidUserPermission(commandObj.requiredPermissions, message);
	commandObj.execute(message, client, args);

});

//Functions and stuff here

async function invalidUserPermission(permissionName, message) {

	function titleCase(str) {
        return str.replace(
            /\w\S*/g,
            function(txt) {
                return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
            }
        );
	}
	const neededPermissions = permissionName.map(s => titleCase(s.replace('_', ' '))).join(', ');
	const invalidUserPermissionMsg = new Discord.RichEmbed()
		.setColor(config.color_red)
		.setTitle("You can't run that command!")
		.setDescription("The command you tried to run requires you to have the " + neededPermissions + " permission, which you currently do not have.");
		return message.channel.send(invalidUserPermissionMsg);
}