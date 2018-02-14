const klasa = require("klasa");
const discord = require("discord.js"); // eslint-disable-line
const { inspect } = require("util");

module.exports = class extends klasa.Command {

    constructor(...args) {
        super(...args, {
            aliases: ["ev"],
            permLevel: 10,
            guarded: true,
            description: (msg) => msg.language.get("COMMAND_EVAL_DESCRIPTION"),
            extendedHelp: (msg) => msg.language.get("COMMAND_EVAL_EXTENDEDHELP"),
            usage: "<expression:str>"
        });

        this.depth = 0;
        this.showHidden = true;
    }

    async run(msg, [code]) {
        const { success, result, time, type } = await this.eval(msg, code);
        const output = this.outputString(success ? "COMMAND_EVAL_OUTPUT" : "COMMAND_EVAL_ERROR",
            time, this.client.methods.util.codeBlock("js", result), type);
        const silent = "silent" in msg.flags;

        // Handle errors
        if (!success) {
            if (result && result.stack) this.client.emit("error", `Author: ${msg.author.tag} (${msg.author.id})\n${result.stack}`);
            if (!silent) return msg.sendMessage(output);
        }

        if (silent) return null;

        // Handle too-long-messages
        if (output.length > 2000) {
            return msg.send(`**Eval output was too long so here you go:** ${await this.client.haste(result, "js")}`);
        }

        // If it's a message that can be sent correctly, send it
        return msg.sendMessage(output);
    }

    // Eval the input
    async eval(msg, code) {
        const client = this.client; // eslint-disable-line
        const guild = msg.guild; // eslint-disable-line
        const gateways = this.client.gateways; // eslint-disable-line

        const stopwatch = new klasa.Stopwatch();
        let success, syncTime, asyncTime, result;
        let thenable = false;
        let type = "";
        try {
            if (msg.flags.async) code = `(async () => { ${code} })();`;
            result = eval(code);
            syncTime = stopwatch.friendlyDuration;
            if (this.client.methods.util.isThenable(result)) {
                thenable = true;
                type += this.client.methods.util.getTypeName(result);
                stopwatch.restart();
                result = await result;
                asyncTime = stopwatch.friendlyDuration;
            }
            success = true;
        } catch (error) {
            if (!syncTime) syncTime = stopwatch.friendlyDuration;
            if (thenable && !asyncTime) asyncTime = stopwatch.friendlyDuration;
            result = error;
            success = false;
        }

        stopwatch.stop();
        type += thenable ? `<${this.client.methods.util.getDeepTypeName(result)}>` : this.client.methods.util.getDeepTypeName(result);
        if (success && typeof result !== "string") {
            result = inspect(result, {
                depth: msg.flags.depth ? parseInt(msg.flags.depth) || this.depth : this.depth,
                showHidden: this.showHidden
            });
        }
        return { success, type, time: this.formatTime(syncTime, asyncTime), result: this.client.methods.util.clean(result) };
    }

    formatTime(syncTime, asyncTime) {
        return asyncTime ? `⏱ ${asyncTime}<${syncTime}>` : `⏱ ${syncTime}`;
    }

    outputString(str, time, output, type) {
        switch (str) {
            case "COMMAND_EVAL_ERROR": return `\`${type} ${time}\`\n**Error:**\n${output}`;
            case "COMMAND_EVAL_OUTPUT": return `\`${type} ${time}\`\n**Output:**\n${output}`;
        }
    }

};
