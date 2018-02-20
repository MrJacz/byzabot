const { Command } = require("klasa");

module.exports = class extends Command {

    constructor(...args) {
        super(...args, {
            enabled: true,
            runIn: ["text"],
            cooldown: 5,
            aliases: ["imnot"],
            botPerms: ["MANAGE_ROLES"],
            description: "TODO: Add description",
            usage: "<Role:string>",
            extendedHelp: "No extended help available."
        });
    }

    async run(msg, [role]) {
        role = this.getRole(role);
        if (!role) throw "The provided role doesn't match.";
        if (msg.member.roles.has(role.id)) {
            if (role.id === "226735941069307906") throw "You cannot remove DaPlaya";
            await msg.members.roles.remove(role.id);
            return msg.send("Sucessfully removed role");
        }
        await msg.member.roles.add(role.id);
        if (!msg.member.roles.has("226735941069307906")) await msg.member.roles.add("226735941069307906");
        return msg.send(`Successfully added role`);
    }

    getRole(str) {
        switch (str.toLowerCase()) {
            case "rocket league": return { name: "Rocket League", id: "279582279699791882" };
            case "overwatch": return { name: "Overwatch", id: "279582417147396106" };
            case "csgo": return { name: "Counter Strike", id: "279582320606969856" };
            case "pubg": return { name: "PUBG", id: "331778725945540620" };
            case "leagueoflegends": return { name: "League Of Legends", id: "414262243228647432" };
            case "fortnite": return { name: "Fortnite", id: "414262098890063873" };
            case "oce": return { name: "Oceania", id: "305723700303626241" };
            case "asia": return { name: "Asia", id: "305723674529366038" };
            case "na": return { name: "NA", id: "305723939697721348" };
            case "eu": return { name: "EU", id: "305723954633506817" };
            case "south america": return { name: "South America", id: "305723724412354561" };
            case "africa": return { name: "Africa", id: "414262667801395210" };
            case "daplaya": return { name: "DaPlaya", id: "226735941069307906" };
            case "default": return null;
        }
    }

};
