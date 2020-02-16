module.exports = {
	name: 'ping',
	description: 'Ping!',
	cooldown: 1,
	execute(message, client, _) {
        message.channel.send('Pong! My latency is ' + client.ping.toFixed(0) + 'ms');
        console.log(client.ping);
	},
};