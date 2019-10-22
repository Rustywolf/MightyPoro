const {
    RichEmbed
} = require("discord.js");
const {
    findCard
} = require("../Database");
const {
    matchAll,
    sendEmbeds,
    URL
} = require("../Util");

function findMatches(text) {
    return matchAll(text, /{(.*?)}/g).map(match => match[1]);
}

const REGION_COLOURS = {
    "Noxus": "#a94c41",
    "Freljord": "#68aad1",
    "Demacia": "#d9dbcd",
    "Piltover & Zaun": "#b78354",
    "Ionia": "#b96683",
    "Shadow Isles": "#55ccae"
};

const RARITY_COLOURS = {
    "Common": "#6cda1a",
    "Rare": "#5bb5f7",
    "Epic": "#ed82ff",
    "Champion": "#ebc117",
    "None": "#767676"
}

const transforms = {
    "name": function (embed, card) {
        embed.author = embed.author || {};
        embed.author.name = card.name;
    },
    "region": function (embed, card) {
        embed.author = embed.author || {};
        embed.author.icon_url = URL(`regions/icon-${card.region.toLowerCase().replace(/[^a-z]/g, "")}.png`);
        embed.description += `**Region: **${card.region}\n`;
    },
    "cost": function (embed, card) {
        embed.description += `**Cost: **${card.cost}\n`;
    },
    "description": function (embed, card, levelup) {
        if (card.descriptionRaw) {
            embed.description += `\n${card.descriptionRaw}\n`;
        }
        if (levelup && levelup.descriptionRaw) {
            embed.description += `\n**Leveled up: **${levelup.descriptionRaw}\n`;
        }
    },
    "stats": function (embed, card, levelup) {
        if (levelup) {
            embed.addField("Attack", `${card.attack} -> ${levelup.attack}`, true);
            embed.addField("Health", `${card.health} -> ${levelup.health}`, true);
        } else {
            embed.addField("Attack", card.attack, true);
            embed.addField("Health", card.health, true);
        }
    },
    "image": function (embed, card, levelup) {
        embed.setThumbnail(URL(`cards/${card.cardCode}.png`));
        if (levelup) {
            embed.setImage(URL(`cards/${levelup.cardCode}.png`))
        }
    },
    "rarity": function (embed, card) {
        embed.setColor(RARITY_COLOURS[card.rarity] || "#767676");
    },
    "keywords": function (embed, card, levelup) {
        if (card.keywords && card.keywords.length > 0) {
            embed.description += `**Keywords: **${card.keywords.join(", ")}\n`;
        }

        if (levelup && levelup.keywords && levelup.keywords.length > 0) {
            embed.description += `**Keywords (Leveled Up): **${levelup.keywords.join(", ")}\n`;
        }
    }
}

const transformList = {
    Unit: ["name", "cost", "region", "keywords", "description", "stats", "image", "rarity"],
    Spell: ["name", "cost", "region", "keywords", "description", "image", "rarity"],
    Ability: ["name", "cost", "region", "keywords", "description", "image", "rarity"],
    Trap: ["name", "cost", "region", "keywords", "description", "image", "rarity"]
};

module.exports = {
    handle: function (text, channel) {
        let queries = findMatches(text);
        let results = queries.map(query => findCard(query)).filter(cards => !!cards[0]);

        let embeds = [];
        for (let cards of results) {
            let embed = new RichEmbed({
                description: ""
            });
            embeds.push(embed);

            for (let transformName of transformList[cards[0].type]) {
                transforms[transformName](embed, cards[0], cards[1]);
            }
        }

        sendEmbeds(channel, embeds);
    }
};