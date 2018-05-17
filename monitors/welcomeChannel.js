const { Monitor, util: { sleep } } = require("klasa");
const { DiscordAPIError } = require("discord.js");

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
        await sleep(5000);
        await msg.delete({ timeout: 5000 }).catch(error => {
            if (error instanceof DiscordAPIError) {
                Error.captureStackTrace(error);
                this.client.console.warn(`[API ERROR]: [CODE: ${error.code}] [METHOD: ${error.method}] [PATH: ${error.path}]\n${error.message}`);
                this.client.console.wtf(error.stack);
            } else {
                this.client.emit("wtf", error);
            }
        });
    }

};
