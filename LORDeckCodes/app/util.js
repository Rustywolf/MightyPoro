const BASE32_DECODE = "ABCDEFGHIJKLMNOPQRSTUVWXYZ234567".split("").reduce((obj, curr, idx) => (obj[curr] = idx, obj), {});

module.exports = {
    ArrayStream: function (array) {
        this.array = array;
        this.idx = 0;

        this.peek = function () {
            return this.array[this.idx];
        }

        this.next = function () {
            return this.array[this.idx++];
        }

        this.hasNext = function () {
            return this.idx < this.array.length;
        }
    },

    b32Decode: function (string) {
        let bytes = [];

        let buffer = 0;
        let shift = 0;
        string.split("").map(c => BASE32_DECODE[c]).forEach(element => {
            buffer <<= 5;
            buffer |= element & 0b00011111;
            shift += 5;

            if (shift >= 8) {
                shift -= 8;
                bytes.push((buffer >> shift) & 0b111111111);
            }
        });

        return bytes;
    }
}