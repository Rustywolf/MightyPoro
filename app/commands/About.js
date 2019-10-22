const {
    RichEmbed
} = require("discord.js");
const {
    URL
} = require("../Util");

let embed = new RichEmbed();
embed.setAuthor("About");
embed.setThumbnail(URL("avatar.png"));
embed.setColor("#b0f1ff");
embed.setDescription("Created by Rusty (/u/Rustywolf, Rusty#4765).\n\n Card data provided by Riot (https://developer.riotgames.com/docs/lor).\n\nProject hosted at https://github.com/Rustywolf/MightyPoro");

module.exports = {
    handle: function (text, channel) {
        if (text.startsWith("!about")) {
            channel.send(embed);
        }
    }
}