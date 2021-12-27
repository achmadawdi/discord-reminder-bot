const Discord = require('discord.js');
const ms = require('ms');
const fs = require('fs');
const dotenv = require('dotenv').config({path: './configuration/.env'});
const client = new Discord.Client();
const env = process.env;
let config = require('./configuration/config.json');
let prefix = config.bot.prefix;
let botMessage = config.message;

const generateCommand = () =>{
	// List file commands
	client.commands = new Discord.Collection();
	const commandsFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));
	for(const file of commandsFiles){
		const commands = require(`./commands/${file}`);
		client.commands.set(commands.name,commands)
	}
}

client.on('ready', async () => {
  generateCommand();
  console.log(`Logged in as ${client.user.tag}!`);    
});

client.on('message', async(message) => {
	// Ignore messages other prefix & bot
	if(!message.content.startsWith(prefix) || message.author.bot)return;

	// Clear message
	setTimeout(() => message.delete(),3000);

	// Get command and args
	const args = message.content.slice(prefix.length).trim().split(/ +/);	
	const command = args.shift().toLowerCase();
	
	// Check if command exists
	if(!client.commands.has(command)){
		message.reply(botMessage.commands.notFound).then(msg => {
			msg.delete({ timeout: 3000 })
		})
		return;
	}

	// Run command
	try{
		client.commands.get(command).execute(message, args);
	}catch(err){
		console.log(err);
		message.reply(botMessage.commands.error)
	}
});

client.login(env.TOKEN);