function ArrayStream(array) {
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
}

function parseTag(stream) {
    console.log("C");
    if (!stream.next() == "<") throw new Exception("Expected tag");

    let tagName = "";
    let value = "";
    let addToValue = false;
    while (stream.hasNext()) {
        let char = stream.next();

        if (char == ">") {
            return createNode(tagName, value);
        } else if (char == "=") {
            addToValue = true;
        } else {
            if (addToValue) {
                value += char;
            } else {
                tagName += char;
            }
        }
    }

    throw new Error("Unexpected end of tag");
}

function parseString(stream) {
    console.log("B");
    let value = "";

    while (stream.hasNext() && stream.peek() != "<") {
        value += stream.next();
    }

    return createNode("", value);
}

function parseNode(stream) {
    console.log("A");
    let char = stream.peek();
    if (char == "<") {
        return parseTag(stream);
    } else {
        return parseString(stream);
    }
}

function createNode(tagName, value) {
    return {
        tagName: tagName || "",
        value: value || "",
        parent: null,
        children: []
    }
}

module.exports = {
    ArrayStream: ArrayStream,

    matchAll: function (string, regex) {
        let results = [];
        let result;
        do {
            result = regex.exec(string);
            result && results.push(result);
        } while (result);

        return results;
    },

    sendEmbeds: async function (textChannel, messages) {
        for (let message of messages) {
            try {
                await textChannel.send(message);
            } catch (e) {
                console.log(e);
            }
        }
    },

    URL: function (path) {
        return process.env.URL + path;
    },

    parseCardDescription: function (desc) {
        let stream = new ArrayStream(desc.split(""));
        let root = createNode();
        let parent = root;
        let parents = [];
        do {
            let node = parseNode(stream);

            if (node.tagName !== "" && node.tagName.toLowerCase() != "sprite name") {
                if (node.tagName.startsWith("/")) {
                    if (node.tagName == "/" + parent.tagName) {
                        parent = parents.pop();
                    } else {
                        console.log(node.tagName + ":" + parent.tagName);
                        throw new Error("Unexpected closing tag");
                    }
                } else {
                    //node.parent = parent;
                    parent.children.push(node);
                    parents.push(parent);
                    parent = node;
                }
            } else {
                //node.parent = parent;
                parent.children.push(node);
            }
        } while (stream.hasNext());

        return root;
    }
};