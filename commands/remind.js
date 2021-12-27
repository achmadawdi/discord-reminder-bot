module.exports = {
	name: 'remind',
	description: 'Remind Commands !',
	execute(message, args){		
		const Discord = require('discord.js');
		const ms = require('ms');
		let config = require('../configuration/config.json');
		let botMessage = config.message;
		let botConfig = config.bot;		
		let dataMessage = {
			user: message.author.id,
			message: "",
			time: ""			
		};

		const replacePlaceholder = (data) =>{			
			if(dataMessage.time !="" || dataMessage.message !=""){
				let time = ms(dataMessage.time, { long: true })
				data.description = data.description.replace(/{time}/g, time);									
				data.description = data.description.replace(/{reminder}/g,dataMessage.message);
				data.footer.text = data.footer.text.replace(/{time}/g, time);				
				data.footer.text = data.footer.text.replace(/{reminder}/g,dataMessage.message);	
			}
			data.description = data.description.replace(/{user}/g,`<@${dataMessage.user}>`);
			data.footer.text = data.footer.text.replace(/{user}/g,`<@${dataMessage.user}>`);
			
			// Will be change to auto generate, not manualy like this
			
			return data;
		}

		const createEmbed = (data) =>{			
			let MessageEmbed = {
				color: "",				
				author: {
					name: "",
					icon_url: ""
				},				
				description: "",
				timestamp: new Date(),
				footer: {
					text: "",
					icon_url: ""
				}
			}			

			return replacePlaceholder({ ...MessageEmbed, ...data});
		}

		const createReminder = () =>{
			let configReminder = botMessage.command.embed.tellReminder;				
			setTimeout(function(){  		
				let MessageEmbed = createEmbed(configReminder);				
				message.reply("",{ embed: MessageEmbed });	
			}, dataMessage.time);  
		}		
		
		const setReminder = () =>{			
			let configReminder = botMessage.command.embed.setReminder;				
			let MessageEmbed = createEmbed(configReminder);
			message.channel.send({ embed: MessageEmbed }).then((msg) => {
				msg.delete({ timeout: botConfig.command.deleteAfterExecuted.miliseccond });								
			});
		}

		const failedReminder = () =>{
			let configReminder = botMessage.command.embed.reminderError;	
			let MessageEmbed = createEmbed(configReminder);
			message.reply("",{ embed: MessageEmbed }).then((msg) => {
				msg.delete({ timeout: botConfig.command.deleteAfterExecuted.miliseccond*5 });								
			});
		}

		
		try{								
			// Generate data message
			const data = args.join(" ").split("time=");  		
			let result = {			
				"message": data[0].trim(),
				"time": ms(data[1]),
			}
			dataMessage = {...dataMessage, ...result};

			// Create reminder
			new Promise(async resolve => {
				await setReminder();
				await createReminder();
				setTimeout(() => {
					resolve()
				}, 0)
			})
	  	}
	  	catch(err){  	
			console.log("Error Caused: ",err.message);
			failedReminder();		
	  	}
	},
};
  	