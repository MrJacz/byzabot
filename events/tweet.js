const { Event } = require("klasa");
const { WebhookClient, MessageEmbed, Util: { escapeMarkdown } } = require("discord.js");
const Twit = require("twit");
const config = require("../config.json");

const twitter = new Twit({
    consumer_key: config.twitter.consumer_key,
    consumer_secret: config.twitter.consumer_secret,
    access_token: config.twitter.access_token,
    access_token_secret: config.twitter.access_token_secret
});

const stream = twitter.stream("statuses/filter", { follow: ["60194851", "2732818747", "703370607119839232"] });

module.exports = class extends Event {

    constructor(...args) {
        super(...args, { emitter: stream });

        this.tweetHook = new WebhookClient(config.webhook.id, config.webhook.token, { disableEveryone: true });
        this.stream = stream;
    }

    async run(tweet) {
        if (tweet.retweeted || tweet.retweeted_status || tweet.in_reply_to_status_id || tweet.in_reply_to_user_id ||
            tweet.delete) return;

        const embed = new MessageEmbed()
            .setAuthor(`@${tweet.user.screen_name}`, "", `https://twitter.com/${tweet.user.screen_name}/status/${tweet.id_str}`)
            .setThumbnail(tweet.user.profile_image_url_https ? tweet.user.profile_image_url_https : "")
            .setTimestamp()
            .setColor(tweet.user.profile_background_color ? tweet.user.profile_background_color : "#7289DA")
            .setDescription([
                tweet.extended_tweet ? tweet.extended_tweet.full_text : tweet.text,
                "",
                `See [**Tweet**](https://twitter.com/${tweet.user.screen_name}/status/${tweet.id_str})`
            ].join("\n"));
        await this.tweetHook.send(`**${escapeMarkdown(tweet.user.name)}** Posted`, { avatarURL: this.client.user.displayAvatarURL(), embeds: [embed] });
    }

};
