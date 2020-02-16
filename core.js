const Discord = require('discord.js');
const client = new Discord.Client();
const fs = require('fs');
const cooldowns = new Discord.Collection();
client.commands = new Discord.Collection();
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));
client.config = require('./config.json');

client.once('ready', () => {
	console.log('Ready!');
});


client.login(client.config.token).catch(error => {
	console.error("==========\nSomething happened and I wasn't able to log-in.\n==========\n" + error);
});

for (const file of commandFiles) {
	const command = require(`./commands/${file}`);

	// set a new item in the Collection
	// with the key as the command name and the value as the exported module
	client.commands.set(command.name, command);
}

client.on('message', async message => {
	if (!message.content.startsWith(client.config.prefix) || message.author.bot) return;

	const args = message.content.slice(client.config.prefix.length).split(/ +/);
	const command = args.shift().toLowerCase();
	const guild = message.guild;

	if (!client.commands.has(command)) return;
		const commandObj = client.commands.get(command);
	if (commandObj.requiredPermissions && !message.member.hasPermission(commandObj.requiredPermissions)) return invalidUserPermission(commandObj.requiredPermissions, message);
	if (commandObj.botPermissions && !guild.me.hasPermission(commandObj.botPermissions)) return invalidBotPermission(commandObj.botPermissions, message);
	if (!cooldowns.has(command.name)) {
		cooldowns.set(command.name, new Discord.Collection());
	}

	const now = Date.now();
	const timestamps = cooldowns.get(command.name);
	const cooldownAmount = (command.cooldown || 3) * 1000;

	if (timestamps.has(message.author.id)) {
		const expirationTime = timestamps.get(message.author.id) + cooldownAmount;
	
		if (now < expirationTime) {
			const timeLeft = (expirationTime - now) / 1000;
			return commandCooldown(timeLeft, command.name, message);
		}
	}

	timestamps.set(message.author.id, now);
	setTimeout(() => timestamps.delete(message.author.id), cooldownAmount);	

	try {
		await commandObj.execute(message, client, args);
	}
	catch (error) {
		console.error("An issue ocurred occurred while running command \"" + commandObj.name + "\"\n" + error);
		const genericErrorMsg = new Discord.RichEmbed()
			.setColor(client.config.color_error)
			.setTitle("An error occurred")
			.setDescription("Something happened while running that command, and it was not completed successfully. This error has been logged.");
			return message.channel.send(genericErrorMsg);
	}
});

//Functions and stuff here

async function commandCooldown(cmdTimeLeft, cmdName, message) {
	const cooldownWarning = new Discord.RichEmbed()
		.setColor(client.config.color_red)
		.setTitle("Slow down!")
		.setDescription("This command is still on cooldown for " + cmdTimeLeft.toFixed(1) + " seconds!");
		return message.channel.send(cooldownWarning);
}

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
		.setColor(client.config.color_red)
		.setTitle("You can't run that command")
		.setDescription("The command you tried to run requires you to have the " + neededPermissions + " permission, which you currently do not have.");
		return message.channel.send(invalidUserPermissionMsg);
}

async function invalidBotPermission(permissionName, message) {

	function titleCase(str) {
        return str.replace(
            /\w\S*/g,
            function(txt) {
                return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
            }
        );
	}
	const neededPermissions = permissionName.map(s => titleCase(s.replace('_', ' '))).join(', ');
	const invalidBotPermissionMsg = new Discord.RichEmbed()
		.setColor(client.config.color_red)
		.setTitle("Unable to run command")
		.setDescription("This command requires that I have the " + neededPermissions + " permissions to continue.");
		return message.channel.send(invalidBotPermissionMsg);
}