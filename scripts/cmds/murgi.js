const delay = (ms) => new Promise(res => setTimeout(res, ms));

const activeMurgi = new Map();

module.exports = {
config: {
name: "murgi",
version: "2.0.0",
role: 2,
author: "MOHAMMAD AKASH",
description: "Loop bad word messages until stopped",
category: "fun",
usages: "@mention | off",
cooldowns: 5,
},

onStart: async function({ message, event, args, api }) {

if (args[0] && args[0].toLowerCase() === "off") {
  if (activeMurgi.has(event.threadID)) {
    activeMurgi.set(event.threadID, false);
    return message.reply("🛑 Murgi mode stopped.");
  } else {
    return message.reply("⚠️ Murgi mode is not running.");
  }
}

const mention = Object.keys(event.mentions)[0];
if (!mention) {
  return message.reply("Please @mention a target first!");
}

const name = event.mentions[mention];
const arraytag = [{ id: mention, tag: name }];

const messages = [
  "খা*নকির পোলা রেডি তো চু*দা খাওয়ার জন্য 😈",
  "এখন তোর মার দুধ দরে ঘুমামু 😚",
  "শুন খানকির পোলা ইডেট করতে করতে মইরা যা 🙄",
  "গালাগালি করতে করতে তোর বুরি মারে সস্তা বানিয়ে ফেলছস 😹",
  "এই ইহুদির পুত এসব ছাড়া কি পারছ 🤣",
  "ফকিন্নির পোলা টিনের ঘরের মুচি 🤣",
  "তোর মারে ১২ মাস চুদে গেলেও কিছু হবে না 😹💥",
  "নাস্তিক 🦶😹",
  "তোর লেংটা মায়রে বিলাইয়ের ধো*ন দিয়ে চুদি 🤣",
  "তর মারে জনগণের মধ্যে ফালাইয়া চোদবো 😹👋"
];

activeMurgi.set(event.threadID, true);
message.reply("🔥 Murgi mode started.");

try {
  while (activeMurgi.get(event.threadID)) {
    for (const msg of messages) {
      if (!activeMurgi.get(event.threadID)) break;

      await delay(2500);

      api.sendMessage({
        body: `${name}\n${msg}`,
        mentions: arraytag
      }, event.threadID);
    }
  }
} catch (err) {
  console.error(err);
  activeMurgi.delete(event.threadID);
  message.reply("Something went wrong!");
}

}
};