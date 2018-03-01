const { Event } = require("klasa");

module.exports = class extends Event {

    run(member) {
        member.send(`
Welcome to Byza’s discord. 

Please make sure to follow the social media accounts in the welcome channel & say hello in the <#331788380742483969> room. Also don’t forget to allocate yourself a role .iam - Some General rules that apply our;
        
- Be kind/respectful to others.
- No self-advertising.
- Be fun & join in on activities
        
Always open to feedback to improve the viewers experience, so if you have anything you would like add feel free to send a pm to Byza! Thank you and enjoy your stay.
`).catch(error => {
            this.client.console.error(`Could not send a direct message to ${member.user.tag}\n${error.stack}`);
        });
    }

};
