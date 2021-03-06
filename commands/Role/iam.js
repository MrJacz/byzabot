const { Command } = require("klasa");

module.exports = class extends Command {

    constructor(...args) {
        super(...args, {
            requiredPermissions: ["MANAGE_ROLES"],
            aliases: ["iamnot"],
            runIn: ["text"],
            cooldown: 5,
            description: "Adds or Removes the specified role to/from user",
            usage: "<Role:string>",
            extendedHelp: "No extended help available."
        });

        this.regions = [
            "305723700303626241",
            "305723674529366038",
            "305723939697721348",
            "305723954633506817",
            "305723724412354561",
            "414262667801395210"
        ];
    }

    async run(msg, [role]) {
        role = this.getRole(role);
        if (!role) throw "The provided role doesn't match.";
        // if the member has the specified role, return the removeRole function
        if (msg.member.roles.has(role.id)) return this.removeRole(msg, role);
        // if the member doesnt have DaPlaya add it to them.
        if (!msg.member.roles.has("226735941069307906")) await msg.member.roles.add("226735941069307906");
        return this.addRole(msg, role);
    }

    async addRole(msg, role) {
        const regionRoles = msg.member.roles.filter(r => this.regions.includes(r.id));
        if (regionRoles.size > 1 && role.type === "region") throw "You can not have more than one region role.";
        await msg.member.roles.add(role.id);
        return msg.send(`Successfully added ${role.name} role to you.`);
    }

    async removeRole(msg, role) {
        if (role.id === "226735941069307906") throw "You cannot remove DaPlaya";
        await msg.member.roles.remove(role.id);
        return msg.send(`Sucessfully removed ${role.name} role from you.`);
    }

    getRole(str) {
        switch (str.toLowerCase()) {
            case "rl":
            case "rocket league": return { name: "Rocket League", id: "279582279699791882", type: "game" };
            case "overwatch": return { name: "Overwatch", id: "279582417147396106", type: "game" };
            case "csgo": return { name: "Counter Strike", id: "279582320606969856", type: "game" };
            case "pubg": return { name: "PUBG", id: "331778725945540620", type: "game" };
            case "leagueoflegends": return { name: "League Of Legends", id: "414262243228647432", type: "game" };
            case "fortnite": return { name: "Fortnite", id: "414262098890063873", type: "game" };
            case "oce": return { name: "Oceania", id: "305723700303626241", type: "region" };
            case "asia": return { name: "Asia", id: "305723674529366038", type: "region" };
            case "na": return { name: "NA", id: "305723939697721348", type: "region" };
            case "eu": return { name: "EU", id: "305723954633506817", type: "region" };
            case "south america": return { name: "South America", id: "305723724412354561", type: "region" };
            case "africa": return { name: "Africa", id: "414262667801395210", type: "region" };
            case "daplaya": return { name: "DaPlaya", id: "226735941069307906", type: "none" };
            case "default": return null;
        }
    }

};
