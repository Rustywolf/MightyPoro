module.exports = {
    decode: function (bytes) {
        var ints = [];
        let current = 0;
        let currentShift = 0;

        bytes.forEach(byte => {
            current |= (byte & 0b01111111) << currentShift;
            if ((byte & 0b10000000) != 0) {
                currentShift += 7;
            } else {
                ints.push(current);
                current = 0;
                currentShift = 0;
            }
        });

        if (currentShift != 0) {
            throw Exception("Trailing Varint provided");
        }

        return ints;
    }
}