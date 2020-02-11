module.exports = {
  name: 'stop',
  description: 'Stops the bot with exit code 0',
  requiredPermissions: [ 'ADMINISTRATOR' ],
    async execute(message, client, __) {
        await message.channel.send('Quitting... goodbye!');
        console.log("==========\nBot was intentionally stopped by !stop\n==========");
        await client.destroy();
    }
};