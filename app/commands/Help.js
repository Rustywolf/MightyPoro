const {
    RichEmbed
} = require("discord.js");
const {
    URL
} = require("../Util");

let embed = new RichEmbed();
embed.setAuthor("Help");
embed.setThumbnail(URL("avatar.png"));
embed.setColor("#b0f1ff");
embed.addField("Card Lookup", "{Mighty Poro} - Searches for \"Mighty Poro\". Allows typos and shortcuts.");
embed.addField("Keyword Lookup", "[Overwhelm] - Searches for \"Overwhelm\". Allows typos and shortcuts.");
embed.addField("Commands", "!help - Shows this menu\n!about - Shows the about menu\n!deckcode <code> - Displays the decklist encoded in the deck code");
embed.addField("Invite", "To invite the bot to a server, use the following link:\nhttps://discordapp.com/api/oauth2/authorize?client_id=634290391449075712&permissions=378944&scope=bot")

module.exports = {
    handle: function (text, channel) {
        if (text.startsWith("!help")) {
            channel.send(embed);
        }
    }
}