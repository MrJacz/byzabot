const { Client } = require("klasa");
const snekfetch = require("snekfetch");
const { WebhookClient } = require("discord.js");
const Twit = require("twit");
const config = require("./config.json");

class ByzaClient extends Client {

    constructor(options) {
        super(options);

        Object.defineProperty(this, "config", { value: config });
        /* eslint-disable */
        this.twitter = new Twit({
            consumer_key: config.twitter.consumer_key,
            consumer_secret: config.twitter.consumer_secret,
            access_token: config.twitter.access_token,
            access_token_secret: config.twitter.access_token_secret
        });
        /* eslint-enable */
        this.tweetHook = new WebhookClient(config.webhook.id, config.webhook.token, { disableEveryone: true });

        this.twitter.stream("statuses/filter", { follow: ["3801387378", "60194851", "2732818747", "703370607119839232"] })
            .on("tweet", tweet => {
                if (tweet.retweeted ||
                    tweet.retweeted_status ||
                    tweet.in_reply_to_status_id ||
                    tweet.in_reply_to_user_id ||
                    tweet.delete) return;
                this.emit("tweet", tweet);
            });
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
    prefix: "!!",
    cmdEditing: true,
    cmdLogging: true,
    regexPrefix: new RegExp(/^((?:Hey |Ok )?Byza(?:,|!))/i),
    console: { useColor: true },
    pieceDefaults: { commands: { deletable: true, cooldown: 10 } },
    clientBaseDir: "src"
}).login(config.token);
