const fuzzball = require('fuzzball');

const MINIMUM_SCORE = 75;
const LANGUAGES = {
    en_us: {
        core: require('../riot/core/en_us/data/globals-en_us.json'),
        sets: [
            require('../riot/set1/en_us/data/set1-en_us.json')
        ]
    }
}

const KEYWORDS = {};
for (let language in LANGUAGES) {
    KEYWORDS[language] = LANGUAGES[language].core.keywords.map(keyword => keyword.name);
}

const CARD_CODES = {};
for (let language in LANGUAGES) {
    CARD_CODES[language] = {};
    for (let set of LANGUAGES[language].sets) {
        for (let card of set) {
            CARD_CODES[language][card.cardCode] = card;
        }
    }
}

const REGIONS = {};
for (let language in LANGUAGES) {
    REGIONS[language] = {};
    for (let region of LANGUAGES[language].core.regions) {
        REGIONS[language][region.nameRef] = region;
    }
}

module.exports = {

    getRegion: function (region, language = "en_us") {
        return (REGIONS[language] && REGIONS[language][region]) || undefined;
    },

    getKeywords: function (language = "en_us") {
        return KEYWORDS[language];
    },

    findKeyword: function (query, language = "en_us") {
        let keywords = LANGUAGES[language].core.keywords;
        let results = fuzzball.extract(query, keywords.map(keyword => keyword.name), {
            returnObjects: true,
            scorer: fuzzball.partial_ratio,
            limit: 1,
            cutoff: MINIMUM_SCORE
        });

        if (results.length > 0) {
            return keywords[results[0].key];
        }
    },

    getCard: function (code, language = "en_us") {
        return (CARD_CODES[language] && CARD_CODES[language][code]) || undefined;
    },

    findCard: function (query, language = "en_us") {
        var sets = LANGUAGES[language].sets;
        let found = [];

        for (let n = 0; n < sets.length; n++) {
            let set = sets[n];
            let names = set.map(card => card.name);
            let results = fuzzball.extract(query, names, {
                returnObjects: true,
                scorer: (a, b) => fuzzball.partial_ratio(a, b) - Math.abs(a.length - b.length),
                limit: 1,
                cutoff: MINIMUM_SCORE
            });

            if (results.length > 0) {
                found.push({ ...set[results[0].key], set: n });
            }
        }

        if (found.length <= 0) {
            return [null];
        }

        let card = null;
        if (found.length == 1) {
            card = found[0];
        } else {
            card = found.sort((a, b) => a.score - b.score)[0];
        }

        if (card) {
            let alts = LANGUAGES[language].sets[card.set].filter(c => c.name == card.name && c.cardCode != card.cardCode);
            if (alts.length > 0) {
                return card.rarity == "Champion" ? [card, alts[0]] : [alts[0], card];
            }
        }

        return [card];
    }
}