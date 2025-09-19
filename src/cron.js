const cron = require("node-cron");
const syncProperties = require("./sync/syncProperties");
const dotenv = require("dotenv");
dotenv.config();

const schedule = process.env.CRON_SCHEDULE || "0 2 * * 0";

cron.schedule(schedule, () => {
  console.log("🔄 Starting weekly property sync...");
  syncProperties();
});

console.log("Cron scheduler started with:", schedule);