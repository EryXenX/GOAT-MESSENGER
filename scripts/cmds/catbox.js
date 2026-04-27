install catbox.js const axios = require("axios");
const fs = require("fs");
const path = require("path");
const FormData = require("form-data");

module.exports = {
  config: {
    name: "catbox",
    version: "2.1",
    author: "EryXenX",
    role: 0,
    shortDescription: "Upload media via API",
    category: "media",
    cooldowns: 5
  },

  onStart: async function ({ api, event }) {
    const { threadID, messageReply, type, messageID } = event;

    if (type !== "message_reply" || !messageReply.attachments.length) {
      return api.sendMessage("❐ Reply to image/video/audio file", threadID, messageID);
    }

    const file = messageReply.attachments[0];
    const filePath = path.join(__dirname, "cache_" + Date.now());

    try {
      const download = await axios({
        url: file.url,
        method: "GET",
        responseType: "stream"
      });

      const writer = fs.createWriteStream(filePath);
      download.data.pipe(writer);

      writer.on("finish", async () => {
        try {
          const form = new FormData();
          form.append("file", fs.createReadStream(filePath));

          const upload = await axios.post(
            "https://catbox-api-d07o.onrender.com/upload",
            form,
            {
              headers: form.getHeaders()
            }
          );

          fs.unlinkSync(filePath);

          if (upload.data && upload.data.url) {
            return api.sendMessage(
              upload.data.url,
              threadID,
              messageID
            );
          } else {
            return api.sendMessage("❌ Upload failed", threadID, messageID);
          }

        } catch (err) {
          fs.existsSync(filePath) && fs.unlinkSync(filePath);
          return api.sendMessage("❌ API error", threadID, messageID);
        }
      });

    } catch (e) {
      return api.sendMessage("❌ Download failed", threadID, messageID);
    }
  }
};