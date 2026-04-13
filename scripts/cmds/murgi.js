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
  "তর মারে জনগণের মধ্যে ফালাইয়া চোদবো 😹👋",
  "তোর মার ভো*দা ফাটাইয়া দিমু শুয়ারের বাচ্চা 😈",
  "খানকি মাগির পোলা, তোর বাপের ধোন খা 🤮",
  "তোর মারে রাস্তার কুত্তা দিয়ে চোদাইয়া ছাড়বো 🐶💦",
  "বেশ্যার ছেলে, তোর মুখে পেচ্ছাপ করি 😹",
  "তোর বোনের ভো*দায় আগুন লাগাইয়া দিমু 🔥",
  "শুয়ারের বাচ্চা, তোর মার দুধ কাটি ফেলবো 🗡️",
  "তোর মাগিরে পাবলিকে চুদে গালি দিয়ে বেড়াবো 🤣",
  "লুচ্চা বান্দরের পোলা, তোর লিঙ্গ কাটি কুকুরে খাওয়ামু 🐕",
  "তোর মা-বোন একসাথে চুদবো রাতভর 😈",
  "হারামজাদা, তোর বাপের কবরে চুদবো তোর মারে 😭",
  "ভো*দা পোড়া খানকির পোলা, তোকে দেখলেই ঘেন্না লাগে 🤢",
  "তোর মারে ডিল্ডো দিয়ে ফাটাইয়া দিমু 🤖💥",
  "রেন্ডির বাচ্চা, তোর পরিবারের সবাইকে চুদবো একে একে 👥",
  "তোর মুখে ধোন ঢুকাইয়া চুপ করাইয়া দিমু 😶",
  "গণিকার পোলা, তোর বুরিতে মরিচের গুড়া দিমু 🌶️🔥"
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
