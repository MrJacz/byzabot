const { Event } = require("klasa");

module.exports = class extends Event {

    run(tweet) {
        console.log(`${tweet.user.name} posted: ${tweet.text}`);
        this.client.tweetHook.send(`
${tweet.user.name} Posted https://twitter.com/${tweet.user.screen_name}/status/${tweet.id_str}
${tweet.text}
`);
    }

};
