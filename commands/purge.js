module.exports = {
	name: 'purge',
	description: 'Removes a mass amount of messages',
	cooldown: 7,
	execute(message, client, _) {
        message.channel.send('Pong! My latency is ' + client.ping.toFixed(0) + 'ms');
        console.log(client.ping);
	},
};