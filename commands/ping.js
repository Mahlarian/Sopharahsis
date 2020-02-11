module.exports = {
	name: 'ping',
	description: 'Ping!',
	execute(message, client, _) {
        message.channel.send('Pong! My latency is ' + client.ping + 'ms');
        console.log(client.ping);
	},
};