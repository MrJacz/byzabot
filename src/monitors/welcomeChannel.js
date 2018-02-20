const { Monitor } = require("klasa");

module.exports = class extends Monitor {

    constructor(...args) {
        super(...args, {
            ignoreBots: false,
            ignoreSelf: false,
            ignoreOthers: false,
            ignoreWebhooks: false
        });
    }

    async run(msg) {
        if (msg.channel.id !== "413270034987614229") return;
        await msg.delete({ timeout: 5000 });
    }

};
