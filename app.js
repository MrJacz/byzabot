const { Client } = require("klasa");
const config = require("./config.json");

new Client({
    fetchAllMembers: true,
    disableEveryone: true,
    messageCacheMaxSize: 1000,
    restTimeOffset: 50,
    prefix: config.prefix,
    commandEditing: true,
    commandLogging: true,
    console: { useColor: true },
    pieceDefaults: { commands: { deletable: true, cooldown: 3, bucket: 2 } },
    presence: { activity: { name: "Byza", type: "WATCHING" } }
}).login(config.token);
