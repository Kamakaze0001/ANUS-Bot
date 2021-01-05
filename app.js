const http = require("http");
const express = require("express");
const app = express();
const fs = require("fs");
const uRobot = require("uptime-robot");
const cron = require("node-cron");
const _ = require("lodash");

// Local Imports
const { Maybe, Envelope } = require("./Classes/Maybe.js");
const { CommandHandler } = require("./Handlers/Command.js");
const { ReactionHandler } = require("./Handlers/Reaction.js");
const { SentenceHandler } = require("./Handlers/Sentence.js");
const { SubsentenceHandler } = require("./Handlers/Subsentence.js");

app.get("/", (request, response) => {
  console.log(Date.now() + " Ping Received");
  response.sendStatus(200);
});

app.listen(process.env.PORT);

// Load up the discord.js library
const Discord = require("discord.js");
const client = new Discord.Client();

// Intialise handlers with the Client's context
CommandHandler.initialise(client);
ReactionHandler.initialise(client);
SentenceHandler.initialise(client);
SubsentenceHandler.initialise(client);

// TODO: Integrate MongoDB rather than just using a text file
let fileContents;

const stdThrow = e => {throw e};

//Birthday Reminder Start =======================================================
cron.schedule(
  "00 12 23 2 *",
  () => {
    client.guilds.cache.array().forEach((guild) => {
      if (guild.systemChannel == null) return;
      var age = new Date().getFullYear() - 2018;
      var superscript;
      if (age > 3 && age < 21) {
        superscript = "th";
      } else {
        switch (age % 10) {
          case 1:
            superscript = "st";
            break;

          case 2:
            superscript = "nd";
            break;

          case 3:
            superscript = "rd";
            break;
          default:
            superscript = "th";
        }
      }
      guild.systemChannel.send(
        `Hey everyone! It's my ${age + superscript} birthday on March 2nd!`
      );
    });
  },
  { scheduled:true, timezone: "Pacific/Auckland" }
);
//Birthday Reminder End =======================================================

fs.readFile("./serverprefs.json", "utf8", (err, data) => {
  if (err) throw err;
  fileContents = JSON.parse(data);
});

const reactFunctions = {
  addpin: {
    action: function(message) {
      if (message.guild.channels.has("363100131911925762")) {
        var channel = message.guild.channels.get("363100131911925762");
        var color = Math.floor(Math.random() * 16777215);
        channel.send({
          embed: {
            color: color,
            author: {
              name: client.user.username,
              icon_url: client.user.avatarURL
            },
            description: "${message.content}",
            timestamp: message.createdTimestamp,
            footer: {
              icon_url: client.user.avatarURL,
              text:
                "By ${message.guild.members.get(message.author.id).nickname}"
            }
          }
        });
      } else {
        message.pin();
      }
    }
  },
  voteremove: {
    action: function(message) {
      message.delete();
    }
  }
};

client.on("ready", () => {
  let test = Maybe.of(5);
  
  console.log(
    `Bot has started in ${client.guilds.cache.size} guilds.`
  );

  client.user.setActivity(`Use .help for commands`);
});

client.on("guildCreate", guild => {
  guild.createEmoji(
    "https://cdn.discordapp.com/emojis/473250569809559572.png",
    "addpin",
    [],
    ["Allows users to vote pin messages"]
  );
  guild.createEmoji(
    "https://cdn.discordapp.com/emojis/474792881719083018.png",
    "voteremove",
    [],
    ["Allows users to vote delete messages"]
  );
});

client.on("messageReactionAdd", (reaction, author) => {
  if (author.id == "440705107135561768") {
    return;
  }

  if (
    reaction.message.author.id == "440705107135561768" &&
    reaction.message.content.substr(0, 5) == "Poll:"
  ) {
    if (!reaction.me) {
      reaction.remove(author);
      return;
    }
  }

  //React Functions
  for (var reactname in reactFunctions) {
    if (reaction.emoji.name == reactname) {
      if (reaction.message.guild in fileContents) {
        if (
          reaction.count > fileContents[reaction.message.guild.id][reactname]
        ) {
          reactFunctions[reactname].action(reaction.message);
        }
      } else {
        if (reaction.count > fileContents["default"][reactname]) {
          reactFunctions[reactname].action(reaction.message);
        }
      }
      break;
    }
  }
});

client.on("message", async message => {
  // Don't respond to bots, lest you piss everyone off and get Anus banned from servers you don't own
  if (message.author.bot) return;

  // TODO: Add channel and channel parent screening arrays
  // TODO: Do this with Mongo too
  if (
    (message.channel.parent &&
     message.channel.parent.name.toLowerCase() == "work channels") ||
     message.channel.id == "245863149755039745"
  ) {
    return;
  }

  // If someone @'s Anus
  if (message.mentions.members.find(val => val.id === client.user.id)) {
    message.channel.send("**WHO SUMMONED ME?!**");
  }
  
  let wrappedMessage = Maybe.of(message);
  
  wrappedMessage
    .map(CommandHandler.handle)
    .map(ReactionHandler.handle)
    .map(SentenceHandler.handle)
    .map(SubsentenceHandler.handle);
  
});

client.login(process.env.TOKEN);
