module.exports = {
  name: 'stop',
  description: 'Stops the bot with exit code 0',
  requiredPermissions: [ 'ADMINISTRATOR' ],
    async execute(message, _, __) {
        await message.channel.send('Quitting... goodbye!');
        console.log("==========\nBot was intentionally stopped by !stop\n==========");
        process.exit(0);
    }
};