const {
    RichEmbed
} = require("discord.js");
const {
    findKeyword
} = require("../Database");
const {
    matchAll,
    sendEmbeds,
    URL
} = require("../Util");

function findMatches(text) {
    return matchAll(text, /\[(.*?)\]/g).map(match => match[1]);
}

module.exports = {
    handle: function (text, channel) {
        let queries = findMatches(text);
        let results = queries.map(query => findKeyword(query)).filter(keyword => !!keyword);

        let embeds = [];
        for (let keyword of results) {
            let embed = new RichEmbed();
            embed.setAuthor(keyword.name, URL(`keywords/${keyword.nameRef.toLowerCase().replace(/ /g, "-")}.png`));
            embed.setDescription(keyword.description);
            embeds.push(embed);
        }

        sendEmbeds(channel, embeds);
    }
}