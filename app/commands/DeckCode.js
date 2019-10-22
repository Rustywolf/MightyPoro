const {
    RichEmbed
} = require("discord.js");
const {
    parseDeckCode
} = require("../../LORDeckCodes/index");
const {
    URL
} = require("../Util");
const {
    getCard,
    getRegion
} = require("../Database");

function sendError(channel) {
    channel.send(new RichEmbed({
        description: "There was an error processing your deck code",
        color: 16073282,
        thumbnail: {
            url: URL("regions/icon-error.jpg")
        },
    })).then(message => {
        setTimeout(() => message.delete(), 10 * 1000);
    });
}

const REGION_ICONS = {
    "ShadowIsles": "<:shadowisles:634975366036979734>",
    "PiltoverZaun": "<:piltoverzaun:634975333166088193>",
    "Noxus": "<:noxus:634975308398723072>",
    "Ionia": "<:ionia:634975286680616990>",
    "Freljord": "<:freljord:634975264144621588>",
    "Demacia": "<:demacia:634975236949016598>"
}

function format(deck) {
    let embed = new RichEmbed();

    deck.forEach(card => card.data = getCard(card.cardCode));

    let regions = deck.map(card => card.regionRef).filter((v, i, s) => s.indexOf(v) === i);
    let champions = deck.filter(card => card.data.rarity == "Champion").map(card => card.data.name);
    embed.setAuthor(champions.length > 0 ? champions.join(" / ") : "No Champions");

    for (let region of regions) {
        let description = "";

        deck.filter(card => card.regionRef == region).sort((a, b) => {
            let sort = b.count - a.count;
            if (sort == 0) {
                return b.name - a.name;
            } else {
                return sort;
            }
        }).forEach(card => {
            description += `**${card.count}** ${card.data.name}\n`;
        });

        embed.addField(`${REGION_ICONS[region]} ${getRegion(region).name}`, description, true);
    }

    return embed;
}

module.exports = {
    handle: function (text, channel) {
        if (text.startsWith("!deckcode") || text.startsWith("!decklist")) {
            let split = text.split(" ");

            if (split.length > 1) {
                let code = split[1];

                try {
                    let deck = parseDeckCode(code);
                    let embed = format(deck);
                    channel.send(embed);
                } catch (e) {
                    sendError(channel);
                }
            } else {
                sendError(channel);
            }
        }
    }
}