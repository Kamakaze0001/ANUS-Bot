const {stdThrow} = require("../Helpers/ErrorHandling.js");

const bigNumbers = {
  "0": "0⃣",
  "1": "1⃣",
  "2": "2⃣",
  "3": "3⃣",
  "4": "4⃣",
  "5": "5⃣",
  "6": "6⃣",
  "7": "7⃣",
  "8": "8⃣",
  "9": "9⃣",
  "10": "🔟"
};

const bigSymbols = {
  B: ":b:",
  "?": ":question:",
  "!": ":exclamation:",
  "+": ":heavy_plus_sign:",
  "-": ":heavy_minus_sign:",
  "*": ":heavy_multiplication_x:",
  "/": ":heavy_division_sign:"
};

const littleText = "ᵃᵇᶜᵈᵉᶠᵍʰᶦʲᵏˡᵐⁿᵒᵖᑫʳˢᵗᵘᵛʷˣʸᶻ⁰¹²³⁴⁵⁶⁷⁸⁹";

class CommandHandler {
  static client = null;
  static commands = {
    ".bigtext": function(message) {
      if (message.guild !== null) {
        if (message.content.length == 0) {
          message.delete();
          message.author.sendMessage(
            "Please do not waste computational power on stupid shit like this. It's already been bugtested"
          );
          return;
        }
        var newMessage = "";
        var precededByColon = false;
        for (var i = 0; i < message.content.length; i++) {
          if (message.content[i] == "<") {
            precededByColon = true;
            newMessage += "<";
            continue;
          } else if (message.content[i] == ">") {
            precededByColon = false;
            newMessage += ">";
            continue;
          }
          if (precededByColon) {
            newMessage += message.content[i];
          } else if (message.content[i] == "B") {
            newMessage += ":b:";
          } else if (message.content[i] == " ") {
            newMessage += "    ";
          } else if (message.content[i] == "\n") {
            newMessage += "\n";
          } else if (
            message.content[i].toLowerCase().charCodeAt(0) > 96 &&
            message.content[i].toLowerCase().charCodeAt(0) < 123
          ) {
            newMessage +=
              ":regional_indicator_" + message.content[i].toLowerCase() + ":";
          } else if (
            message.content[i] >= 0 &&
            message.content[i] < 10 &&
            message.content[i] != " "
          ) {
            newMessage += bigNumbers[message.content[i]];
          } else if (bigSymbols[message.content[i]]) {
            newMessage += bigSymbols[message.content[i]];
          } else {
            newMessage += message.content[i];
          }
        }
        message.delete();
        message.channel.send(newMessage).then(() => {
          if (message.guild.members.get(message.author.id).nickname) {
            message.channel.send(
              " - " + message.guild.members.get(message.author.id).nickname
            ).catch(stdThrow);
          } else {
            message.channel.send(" - " + message.author.username).catch(stdThrow);
          }
        }).catch(stdThrow);
      }
    },
    ".poll": function(message) {
      var test = message.channel
        .send({
          embed: {
            color: 14353241,
            description: "Poll: " + message.content
          }
        })
        .then(poll => {
          poll.react("👍").then(() => {
            poll.react("👎").then(() => {
              poll.react("❓").catch(stdThrow);
            }).catch(stdThrow);
          }).catch(stdThrow);
          setTimeout(function() {
            poll.edit({
              embed: {
                color: 12303291,
                description: "Poll: " + message.content
              }
            });
          }, 600000);
        }).catch(stdThrow);
    },
    ".someone": async function(message) {
      var rando;
      console.log("Locating random");
      while (true) {
        let members = await message.guild.members.fetch().catch(stdThrow);
        rando = members.random().user;
        if (!rando.bot && rando.id != message.author.id) {
          break;
        }
      }
      message.channel.send("<@" + rando.id + ">").catch(stdThrow);
    },
    ".smalltext": function(message) {
      if (message.guild !== null) {
        if (message.content.length == 0) {
          message.delete();
          message.author.sendMessage(
            "Please do not waste computational power on stupid shit like this. It's also been bugtested"
          ).catch(stdThrow);
          return;
        }
        var newMessage = "";
        var precededByColon = false;
        for (var i = 0; i < message.content.length; i++) {
          if (message.content[i] == "<") {
            precededByColon = true;
            newMessage += "<";
            continue;
          } else if (message.content[i] == ">") {
            precededByColon = false;
            newMessage += ">";
            continue;
          }
          if (precededByColon) {
            newMessage += message.content[i];
          } else if (message.content[i] == "\n") {
            newMessage += " ";
          } else if (
            message.content[i].toLowerCase().charCodeAt(0) > 96 &&
            message.content[i].toLowerCase().charCodeAt(0) < 123
          ) {
            newMessage +=
              littleText[message.content[i].toLowerCase().charCodeAt(0) - 97];
          } else if (
            message.content[i] >= 0 &&
            message.content[i] < 10 &&
            message.content[i] != " "
          ) {
            newMessage += littleText[parseInt(message.content[i]) + 26];
          } else {
            newMessage += message.content[i];
          }
        }
        message.delete().catch(stdThrow);
        message.channel.send(newMessage).then(() => {
          if (message.guild.members.get(message.author.id).nickname) {
            message.channel.send(
              " - " + message.guild.members.get(message.author.id).nickname
            );
          } else {
            message.channel.send(" - " + message.author.username);
          }
        }).catch(stdThrow);
      }
    },
    ".invite": function(message) {
      CommandHandler.client
        .generateInvite([
          "SEND_MESSAGES",
          "CREATE_INSTANT_INVITE",
          "ADD_REACTIONS",
          "MANAGE_MESSAGES",
          "READ_MESSAGE_HISTORY",
          "SEND_MESSAGES",
          "MANAGE_EMOJIS"
        ])
        .then(link => {
          message.author.send(link);
        }).catch(stdThrow);
    },
    ".setremove": function(message) {
      if (message.content.length > 0 && !message.content.match(/[^0-9]/g)) {
        if (message.member.hasPermission("MANAGE_GUILD")) {
          if (message.guild.id in fileContents) {
            fileContents[message.guild.id].voteremove = parseInt(message.content);
          } else {
            fileContents[message.guild.id] = {
              voteremove: parseInt(message.content),
              addpin: 5
            };
          }
          fs.writeFile(
            "./serverprefs.json",
            JSON.stringify(fileContents),
            err => {
              if (err) {
                message.react("❌");
                throw err;
              }
              else {
                message.react("✅");
              }
            }
          );
        } else {
          message.react("❌");
        }
      } else {
        message.react("❌");
      }
    },
    ".getremove": function(message) {
        if (message.guild.id in fileContents) {
          message.channel.send(`A message needs to get to ${fileContents[message.guild.id].voteremove} reacts before I'll remove it.`);
        } else {
          message.channel.send(`A message needs to get to 8 reacts before I'll remove it.`);
        }
    },
    ".setpin": function(message) {
      if (message.content.length > 0 && !message.content.match(/[^0-9]/g)) {
        if (message.member.hasPermission("MANAGE_GUILD")) {
          if (message.guild.id in fileContents) {
            fileContents[message.guild.id].addpin = parseInt(message.content);
          } else {
            fileContents[message.guild.id] = {
              voteremove: 8,
              addpin: parseInt(message.content)
            };
          }
          fs.writeFile(
            "./serverprefs.json",
            JSON.stringify(fileContents),
            err => {
              if (err) {
                message.react("❌");
                throw err;
              }
              else{
                message.react("✅");
              }
            }
          );
        } else {
          message.react("❌");
        }
      } else {
        message.react("❌");
      }
    },
    ".getpin": function(message) {
        if (message.guild.id in fileContents) {
          message.channel.send(`A message needs to get to ${fileContents[message.guild.id].addpin} reacts before I'll pin it.`);
        } else {
          message.channel.send(`A message needs to get to 5 reacts before I'll remove it.`);
        }
    },
    ".incrediblysmalltext": function(message) {
      setTimeout(() => {
        message.delete();
      }, 1500);
    },
    ".help": function(message) {
      message.author.send({
        embed: {
          description:
            "**__Basic Commands:__**\n**Message.poll** - Create a poll\n**Message.snjort** - Recreate your message in scandanavian\n**Message.copypasta** - Format a message like a copypasta\n**Message.bigtext** - Recreate your message in big text\n**Message.smalltext** - Recreate your message in small text\n**Message.incrediblysmalltext** - Recreate your message in inadvisably small text\n**Title (Optional): Option 1, Option 2, ..., Option 10.choose** - Poll for a number of options\n**.someone** - Mention a random user in this server\n**.invite** - Generate an invite to add me to another server\n**.getpin** - Get the pin threshold for this server\n**.getremove** - Get the remove threshold for this server\n\n**__Admin Commands:__**\n**Number.setpin** - Set the pin threshhold\n**Number.setremove** - Set the remove threshhold",
          url: "https://discordapp.com",
          color: 10578656,
          footer: {
            icon_url: "https://cdn.discordapp.com/embed/avatars/0.png",
            text: "Created by Damon Jenkins in Discord.js | Hosted on Glitch.com"
          },
          author: {
            name: "ANUS Bot",
            url: "https://discordapp.com",
            icon_url: "https://cdn.discordapp.com/embed/avatars/0.png"
          }
        }
      });
    },
    ".snjort": function(message) {
      if (message.content.length > 0) {
        var newMessage = "";
        for (var i = 0; i < message.content.length; i++) {
          if (message.content[i].match(/([AEIOUY])/g)) {
            newMessage += "J" + message.content[i];
          } else if (message.content[i].match(/([aeiouy])/g)) {
            newMessage += "j" + message.content[i];
          } else {
            newMessage += message.content[i];
          }
        }

        message.channel.send(newMessage);
      }
    },
    ".choose": function(message) {
      let components = message.content.split(':', 2)
      let body, title;

      if(components.length == 1) {
        title = undefined;
        body = message.content;
      }else if(components.length > 0){
        title = components[0];
        body = message.content.substr(title.length+1).trim();
      }else{
        message.react("❌");
        return;
      }

      var opts = body.split(',');

      if (opts.length > 10) {
        message.react("❌");
        return;
      }

      var msg = "";

      for (var i = 0; i < opts.length; i++) {
        if (i < 10) {
          msg += `${bigNumbers[i + 1]}: ${opts[i].trim()}\n`;
        }
      }

      message.channel
        .send({
          embed: {
            color: 4163781,
            title: title,
            description: "**__Choose:__** \n" + msg,
            footer: {
              text: `@${message.author.username}`
            }
          }
        })
        .then(async poll => {
          for (var i = 0; i < opts.length; i++) {
            await poll.react(bigNumbers[i + 1]);
          }
        }).catch(stdThrow);

      message.delete();
    },
    ".copypasta": function(message) {
      message.channel.send(`\`\`\`\n${message.content}\n\`\`\``);
    },
    ".sendforme": function(message) {
      if (message.author.id == "156602468413865984") {
        message.channel.send(message.content);
        message.delete();
      }
    }
  };
  
  static initialise(client){
    CommandHandler.client = client;
  }
  
  static handle(message){
    for (var command in CommandHandler.commands) {
      if (
        message.content
          .substr(message.content.length - command.length)
          .toLowerCase() == command
      ) {
        message.content = message.content.slice(0, -command.length);
        try{
          CommandHandler.commands[command](message);
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

exports.CommandHandler = CommandHandler;