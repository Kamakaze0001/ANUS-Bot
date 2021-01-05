const _ = require("lodash");

const {stdThrow} = require("../Helpers/ErrorHandling.js");

class SentenceHandler {
  static client = null;
  static sentences = [
    [["hey anus", "hi anus", "hello anus", "howdy anus", "sup anus", "whats poppin anus", "wassup anus", "whats up anus"], 
     message => {
      message.channel.send(_.sample([
        "Hey",
        "Hi",
        "Hello",
        "Howdy",
        "Sup",
        "What's up?",
        "Suh dude",
        "What",
        "Something wrong?",
        "You need something?"
      ])).catch(stdThrow);
    }],
    [["flip a coin", "can you flip a coin", "please flip a coin"], 
     message => {
      message.channel.send(_.sample([
        "Heads!",
        "Tails!"
      ])).catch(stdThrow);
    }],
    [["thanks anus", "thank you anus", "thankyou anus"], 
     message => {
      message.channel.send(_.sample([
        "You're welcome!",
        "No problem",
        "My pleasure!"
      ])).catch(stdThrow);
    }],
    [["what team", "hey what team"], 
     message => {
       message.channel.send("🇼 🇮 🇱 🇩   🇨 🇦 🇹 🇸 ‼️").catch(stdThrow);
    }],
    [["and they dont stop coming", "and they dont stop comin"], 
     message => {
       message.channel.send("and they don't stop coming").catch(stdThrow);
    }]
  ];
  
  static initialise(client){
    SentenceHandler.client = client;
  }
  
  static handle(message){
    // Respond to sentences
    let simpleSentence = message.content
    .toLowerCase()
    .replace(/[^a-z0-9A-Z\s]/g, "");
    
    for(let item of SentenceHandler.sentences){
      if(item[0].includes(simpleSentence)){
        try{
          item[1](message);
        } catch(e) {
          console.error(e);
        } finally{
          return null;
        }
      }
    }
    
    return message;
  }
}

exports.SentenceHandler = SentenceHandler;