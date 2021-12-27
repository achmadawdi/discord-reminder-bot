module.exports = {
	name: 'prefix',
	description: 'Prefix Commands !',
	execute(message, args){
		prefix = args[0];
		console.log(prefix);
	},
};