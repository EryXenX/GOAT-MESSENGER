┌─────────────────────────────────────────────
│             GOAT ADVANCED
│       STEP-BY-STEP INSTALL GUIDE
└─────────────────────────────────────────────

This guide will show you how to set up GOAT ADVANCED, deploy it on Render, and monitor it using UptimeRobot.

─────────────────────────────────────────────
1️⃣ IMPORT REPOSITORY ON GITHUB

1. Log in to Github.
2. Click New Repository → Import repository.
3. Paste the repository link:
   https://github.com/akashx404/GOAT-ADVANCED.git
4. Select Private Repository.
5. Click Begin import.

> Now your own private repository has been created.

─────────────────────────────────────────────
2️⃣ CONFIGURE config.json

1. Clone the repository or edit config.json on Github.
2. Set the following values:

{
  "nickNameBot": "♡┋Տʜɪᴢᴜᴋꫝㅤᥫ᭡",
  "adminBot": [
    "100078049308655",
    "61577213967981"
  ],
  "uid": "YOUR_FB_UID"
}

- nickNameBot: Bot's display name.
- adminBot: Facebook IDs of the admins.
- uid: Your Facebook user ID.

─────────────────────────────────────────────
3️⃣ EXPORT FACEBOOK COOKIE

1. Install C3C FBState Utility Extension.
2. Log in to the Facebook account you will use for the bot.
3. Use the extension to export JSON cookie.
4. Paste the copied JSON into account.txt.

> Keep this file safe, do not share it with anyone.

─────────────────────────────────────────────
4️⃣ DEPLOY ON RENDER

1. Log in to Render.com.
2. Click New Web Service → Connect Github Repo → select your private repository.
3. Set environment variables if needed (.env).
4. Click Deploy.
5. Once deployed, copy the Render URL.

─────────────────────────────────────────────
5️⃣ MONITOR WITH UPTIMEROBOT

1. Log in to UptimeRobot.com.
2. Click Add New Monitor → Monitor Type: HTTP(s).
3. Paste your Render URL.
4. Set the check interval (e.g., 5 minutes).
5. Click Create Monitor.

> Your bot will now run 24/7 and be monitored by UptimeRobot.

─────────────────────────────────────────────
CONGRATULATIONS
You have successfully set up GOAT BOT V2. Your bot is now running and your admin IDs are active.
─────────────────────────────────────────────
