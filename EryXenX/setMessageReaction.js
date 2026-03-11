"use strict";

const logger = require("../../../func/logger");
const { generateOfflineThreadingID, getCurrentTimestamp } = require("../../utils/format");

module.exports = function (defaultFuncs, api, ctx) {
  return function setMessageReaction(reaction, messageID, threadID, callback, forceCustomReaction) {
    // ✅ PATCH: old style support - threadID optional
    // Old style: (reaction, messageID, callback, forceCustom)
    // new style: (reaction, messageID, threadID, callback, forceCustom)
    if (typeof threadID === "function") {
      forceCustomReaction = callback;
      callback = threadID;
      threadID = null; // threadID নেই
    } else if (typeof threadID === "boolean") {
      forceCustomReaction = threadID;
      callback = undefined;
      threadID = null;
    } else if (typeof callback === "boolean") {
      forceCustomReaction = callback;
      callback = undefined;
    }
    const cb = typeof callback === "function" ? callback : undefined;

    return new Promise((resolve, reject) => {
      if (!ctx.mqttClient) {
        const err = new Error("MQTT client not connected");
        if (cb) cb(err);
        return reject(err);
      }
      if (reaction === undefined || reaction === null || !messageID) {
        const err = new Error("Missing required parameters (reaction, messageID)");
        if (cb) cb(err);
        return reject(err);
      }

      // ThreadID with MaasageID
      // Or ctx 
      const finalThreadID = threadID || ctx.lastThreadID || "0";

      if (typeof ctx.wsReqNumber !== "number") ctx.wsReqNumber = 0;
      if (typeof ctx.wsTaskNumber !== "number") ctx.wsTaskNumber = 0;
      const reqID = ++ctx.wsReqNumber;
      const taskID = ++ctx.wsTaskNumber;
      const taskPayload = {
        thread_key: finalThreadID,
        timestamp_ms: getCurrentTimestamp(),
        message_id: messageID,
        reaction: reaction,
        actor_id: ctx.userID,
        reaction_style: forceCustomReaction ? 1 : null,
        sync_group: 1,
        send_attribution: 65537,
        dataclass_params: null,
        attachment_fbid: null
      };
      const task = {
        failure_count: null,
        label: "29",
        payload: JSON.stringify(taskPayload),
        queue_name: "reaction:" + messageID,
        task_id: taskID,
      };
      const mqttForm = {
        app_id: "2220391788200892",
        payload: JSON.stringify({
          epoch_id: parseInt(generateOfflineThreadingID()),
          tasks: [task],
          version_id: "24585299697835063"
        }),
        request_id: reqID,
        type: 3
      };
      const handleResponse = (topic, message) => {
        if (topic !== "/ls_resp") return;
        let json;
        try {
          json = JSON.parse(message.toString());
          json.payload = JSON.parse(json.payload);
        } catch {
          return;
        }
        if (json.request_id !== reqID) return;
        ctx.mqttClient.removeListener("message", handleResponse);
        if (cb) cb(null, { success: true });
        return resolve({ success: true });
      };
      ctx.mqttClient.on("message", handleResponse);
      ctx.mqttClient.publish("/ls_req", JSON.stringify(mqttForm), { qos: 1, retain: false }, (err) => {
        if (err) {
          ctx.mqttClient.removeListener("message", handleResponse);
          logger("setMessageReaction" + err, "error");
          if (cb) cb(err);
          return reject(err);
        }
      });
    });
  };
};
