const {
    stringToBytes, ArrayStream, b32Decode
} = require('./util');
const {
    decode
} = require('./varints');

const REGIONS = [
    { code: "DE", ref: "Demacia" },
    { code: "FR", ref: "Freljord" },
    { code: "IO", ref: "Ionia" },
    { code: "NX", ref: "Noxus" },
    { code: "PZ", ref: "PiltoverZaun" },
    { code: "SI", ref: "ShadowIsles" },
    { code: "BW", ref: "Bilgewater" }
]

function getCards(count, stream, raw = false) {
    let cards = [];
    let setRegionCount = stream.next();

    for (let n = 0; n < setRegionCount; n++) {
        let setRegionCardCount = stream.next();
        let set = stream.next();
        let region = stream.next();
        let regionData = REGIONS[region];

        for (let i = 0; i < setRegionCardCount; i++) {
            let cardNumber = stream.next();
            let cardCode = set.toString().padStart(2, "0") + regionData.code + cardNumber.toString().padStart(3, "0");

            cards.push(raw ? cardCode : {
                set: set,
                region: regionData.code,
                regionRef: regionData.ref,
                number: cardNumber,
                count: count,
                cardCode: cardCode
            });
        }
    }

    return cards;
}

function parseDeckCode(string, raw = false) {
    let bytes = b32Decode(string);
    let ints = decode(bytes);
    let stream = new ArrayStream(ints);
    let deck = [];

    let format = stream.next();
    if (format != 0b00010001) {
        throw new Exception("Unknown format/version provided");
    }

    for (var n = 3; n > 0; n--) {
        deck.push(...getCards(n, stream, raw));
    }

    return deck;
}

module.exports = {
    parseDeckCode
};