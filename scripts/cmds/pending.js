const fs = require("fs");

module.exports = {
  config: {
    name: "pending",
    version: "1.0.7",
    author: "MOHAMMAD AKASH",
    aliases: [],
    role: 2,
    shortDescription: "Manage bot's waiting messages",
    longDescription: "Approve or cancel pending groups",
    category: "owner",
    countDown: 10
  },

  languages: {
    en: {
      invaildNumber: "%1 IS NOT A VALID NUMBER",
      cancelSuccess: "❌ REFUSED %1 THREADS!",
      notiBox:
        "✨🎉 CONGRATS! YOUR GROUP HAS BEEN APPROVED! 🎉✨\n🚀 USE !help TO SEE ALL COMMANDS",
      approveSuccess: "✅ APPROVED %1 THREADS!",
      cantGetPendingList: "⚠️ CAN'T GET THE PENDING LIST!",
      returnListPending:
        "»「PENDING」«\nTOTAL THREADS TO APPROVE: %1\n\n%2",
      returnListClean:
        "「PENDING」THERE IS NO THREAD IN THE LIST"
    }
  },

  _getText(key, ...args) {
    const text = this.languages.en[key] || key;
    return args.length
      ? text.replace("%1", args[0]).replace("%2", args[1] || "")
      : text;
  },

  onStart: async function ({ api, event }) {
    const { threadID, messageID, senderID } = event;
    let pendingList = [];

    try {
      const other = await api.getThreadList(100, null, ["OTHER"]);
      const pending = await api.getThreadList(100, null, ["PENDING"]);
      pendingList = [...other, ...pending].filter(
        g => g.isGroup && g.isSubscribed
      );
    } catch {
      return api.sendMessage(
        this._getText("cantGetPendingList"),
        threadID,
        messageID
      );
    }

    if (!pendingList.length)
      return api.sendMessage(
        this._getText("returnListClean"),
        threadID,
        messageID
      );

    let msg = "";
    pendingList.forEach((g, i) => {
      msg += `${i + 1}/ ${g.name} (${g.threadID})\n`;
    });

    return api.sendMessage(
      this._getText("returnListPending", pendingList.length, msg),
      threadID,
      (err, info) => {
        global.GoatBot.onReply.set(info.messageID, {
          commandName: this.config.name,
          author: senderID,
          pending: pendingList
        });
      },
      messageID
    );
  },

  onReply: async function ({ event, Reply, api }) {
    const { author, pending } = Reply;
    if (String(event.senderID) !== String(author)) return;

    const input = event.body.trim().toLowerCase().split(/\s+/);
    const botID = api.getCurrentUserID();
    const nickNameBot = global.GoatBot?.config?.nickNameBot;
    let count = 0;

    // ❌ CANCEL
    if (input[0] === "c" || input[0] === "cancel") {
      for (let i = 1; i < input.length; i++) {
        const idx = parseInt(input[i]);
        if (isNaN(idx) || idx <= 0 || idx > pending.length)
          return api.sendMessage(
            this._getText("invaildNumber", input[i]),
            event.threadID
          );

        await api.removeUserFromGroup(
          botID,
          pending[idx - 1].threadID
        );
        count++;
      }

      return api.sendMessage(
        this._getText("cancelSuccess", count),
        event.threadID
      );
    }

    // ✅ APPROVE
    for (const v of input) {
      const idx = parseInt(v);
      if (isNaN(idx) || idx <= 0 || idx > pending.length)
        return api.sendMessage(
          this._getText("invaildNumber", v),
          event.threadID
        );

      const tID = pending[idx - 1].threadID;

      await api.sendMessage(this._getText("notiBox"), tID);

      if (nickNameBot)
        await api.changeNickname(nickNameBot, tID, botID);

      count++;
    }

    return api.sendMessage(
      this._getText("approveSuccess", count),
      event.threadID
    );
  }
};
