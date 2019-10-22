require('dotenv').config();

const Discord = require('discord.js');
const client = new Discord.Client();

const commands = [
    require('./commands/CardSearch').handle,
    require('./commands/DeckCode').handle,
    require('./commands/Keywords').handle,
    require('./commands/Help').handle,
    require('./commands/About').handle
];

client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);
    client.user.setActivity('for {Card Lookups}', {
        type: 'WATCHING'
    });
});

client.on('message', msg => {
    try {
        for (let handle of commands) {
            handle(msg.content, msg.channel);
        }
    } catch (e) {
        console.log(e);
    }
});

client.login(process.env.TOKEN);