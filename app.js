const { Client } = require("klasa");
const snekfetch = require("snekfetch");
const config = require("./config.json");

class ByzaClient extends Client {

    constructor(options) {
        super(options);

        Object.defineProperty(this, "config", { value: config });
    }

    async haste(input, extension = "js") {
        if (!input) throw new Error("Input argument is required.");
        const { body: { key } } = await snekfetch.post("https://hastebin.com/documents").send(input).catch(e => { throw e; });
        return `https://hastebin.com/${key}.${extension}`;
    }

}

new ByzaClient({
    disabledEvents: [
        "RELATIONSHIP_REMOVE",
        "RELATIONSHIP_ADD",
        "TYPING_START",
        "USER_SETTINGS_UPDATE",
        "USER_NOTE_UPDATE",
        "GUILD_SYNC"
    ],
    disableEveryone: true,
    prefix: ".",
    cmdEditing: true,
    cmdLogging: true,
    regexPrefix: new RegExp(/^((?:Hey |Ok )?Byza(?:,|!))/i),
    console: { useColor: true },
    pieceDefaults: { commands: { deletable: true, cooldown: 10 } },
    clientBaseDir: "src"
}).login(config.token);
