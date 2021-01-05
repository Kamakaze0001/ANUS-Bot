const _ = require("lodash");

const {stdThrow} = require("../Helpers/ErrorHandling.js");

class SubsentenceHandler {
  static client = null;
  static subsentences = [
    // This is the functionality what gives the bot its name
    // ANUS: Anti Nobu Usage Screening
    // I initially made this to stop someone from being annoying in University Discord servers
    // They referred to themselves in the third person as "Nobu" because they weren't content
    // with our "No nicknames" policy
    [["nobu", "n0bu", ], message => {
      message.delete().catch(stdThrow);
      message.reply({
        embed: {
          color: 14820610,
          description: "This is a strict anti-Nobu zone!"
        }
      }).catch(stdThrow);
    }], 
    [["r word"], message => { // We're talking about the work "Rark"
      message.channel.send(_.sample([
        "What word are you talking about?",
        "What do you mean?",
        "Which R word?"
      ])).catch(stdThrow);
    }], 
    [["gamers"], message => {
      message.react(SubsentenceHandler.client.emojis.get("474793269230829580")).catch(stdThrow);
    }], 
    [["can i"], message => { // TODO: Add a cooldown so that Anus isn't too annoying
      message.channel.send(`I dunno, can you?`).catch(stdThrow);
    }]
  ];
  
  static initialise(client){
    SubsentenceHandler.client = client;
  }
  
  static handle(message){
    // Respond to subsentences
    let strippedMessage = message.content
    .toLowerCase() 
    .replace(/[^a-z0-9A-Z\s]/g, "") // Remove anything that isn't alphanumeric
    .trim()
    .replace(/ +(?= )/g,''); // Remove double spaces
    
    for(let item of SubsentenceHandler.subsentences){
      for(let i = 0; i < item[0].length; i++){
        let regex = new RegExp(`(^|\\W)(${item[0][i]})(\\W|$)`); // Make sure we're not getting false positives from substrings e.g. wa(r word)s
        if(regex.test(strippedMessage)){
          try{
            item[1](message);
            return null;
          } catch(e) {
            console.error(e);
          } finally{
            return null;
          }
        }
      }
    }
    
    return message;
  }
}

exports.SubsentenceHandler = SubsentenceHandler;