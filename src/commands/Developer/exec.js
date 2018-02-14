const { Command, util: { codeBlock, exec } } = require("klasa");

module.exports = class extends Command {

    constructor(...args) {
        super(...args, {
            permLevel: 10,
            description: "Execute commands in the terminal, use with EXTREME CAUTION.",
            usage: "<expression:str>",
            aliases: ["bash"]
        });
    }

    async run(msg, [input]) {
        const result = await exec(input).catch((err) => { throw err; });
        const output = result.stdout ? `**\`OUTPUT\`**${result.stdout.length >= 1900 ? await this.client.haste(result.stdout, "bash") : codeBlock("sh", result.stdout)}` : "";
        const outerr = result.stderr ? `**\`ERROR\`**${codeBlock("sh", result.stderr)}` : "";
        return msg.send([output, outerr].join("\n"));
    }

};
