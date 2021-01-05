const {stdThrow} = require("../Helpers/ErrorHandling.js");

class ReactionHandler {
  static client = null;
  static reactions = {
    "mood": ['🇲','🇴','⭕','🇩'],
    "tbh": ['🇹','🇧','🇭'],
    "rark": ['🇷','🇦','®️','🇰']
  };
  
  static initialise(client){
    ReactionHandler.client = client;
  }
  
  static handle(message){
    let args = message.content
      .toLowerCase() 
      .replace(/[^a-z0-9A-Z\s]/g, "") // Remove anything that isn't alphanumeric
      .trim()
      .split(/ +/g); // Split on any number of spaces

    let reactionQueue = Promise.resolve(message);
    for (let i = 0; i < args.length; i++) {
      if (args[i] in ReactionHandler.reactions) {
        reactionQueue = reactionQueue.then(async message => {
          try{
            await ReactionHandler.reactWith(message, ReactionHandler.reactions[args[i]]);
          }catch (err) {
            console.error(err)
          }
        });
      }
    }
    
    return message;
  }
  
  static async reactWith(message, chars){
    for (var i = 0; i < chars.length; i++) {
      let reactPromise = message.react(chars[i]).catch(stdThrow);
      if(i < chars.length-1) await reactPromise;
      else return reactPromise;
    }
  }
}

exports.ReactionHandler = ReactionHandler;