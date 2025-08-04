#!/usr/bin/env node

console.log("ðŸ” Checking environment variables...");
console.log(
  "TELEGRAM_BOT_TOKEN:",
  process.env.TELEGRAM_BOT_TOKEN ? "… Set" : "âŒ Not set"
);
console.log(
  "TELEGRAM_CHAT_ID:",
  process.env.TELEGRAM_CHAT_ID ? "… Set" : "âŒ Not set"
);
console.log("GIT_BRANCH:", process.env.GIT_BRANCH || "Not set");
console.log("GIT_AUTHOR:", process.env.GIT_AUTHOR || "Not set");
console.log("GITHUB_REPOSITORY:", process.env.GITHUB_REPOSITORY || "Not set");

// Test with mock data
const testData = {
  numTotalTests: 334,
  numPassedTests: 334,
  numFailedTests: 0,
  numPendingTests: 0,
  testExecError: false,
};

console.log("\nðŸ“‹ Test data that would be sent:");
console.log(JSON.stringify(testData, null, 2));

const TelegramTestNotifier = require("./TelegramTestNotifier");
const notifier = new TelegramTestNotifier();
console.log("\nðŸ“± Telegram enabled:", notifier.enabled);

// If enabled, send test notification
if (notifier.enabled) {
  console.log("\nðŸ“¤ Sending test notification...");
  notifier
    .sendTestResults(testData)
    .then(() => console.log("… Notification sent successfully"))
    .catch((error) =>
      console.error("âŒ Error sending notification:", error.message)
    );
} else {
  console.log(
    '\nâš ï¸ Telegram not enabled - would show "NO TESTS" in actual run'
  );
}
