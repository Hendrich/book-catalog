﻿#!/usr/bin/env node

/**
 * Demo clean format notification like the image
 */

require('dotenv').config();
const TelegramTestNotifier = require('./TelegramTestNotifier');

async function testCleanFormat() {
  console.log('ðŸ“± Testing clean format notification like the image...');
  
  const notifier = new TelegramTestNotifier();
  
  if (!notifier.enabled) {
    console.log('âŒ Telegram bot not enabled');
    return;
  }
  
  // Sample test data like in the image
  const testData = {
    total: 179,
    passed: 66,
    failed: 49,
    skipped: 61,
    duration: 650494,
    hasErrors: true
  };
  
  // Sample coverage data
  const coverageData = {
    statements: { pct: 82.27, covered: 376, total: 457 },
    branches: { pct: 72.52, covered: 161, total: 222 },
    functions: { pct: 78.84, covered: 41, total: 52 },
    lines: { pct: 82.30, covered: 372, total: 452 }
  };
  
  const options = {
    projectName: 'lab Catalog App',
    branch: 'main',
    author: 'Admin lab Catalog',
    timestamp: new Date()
  };
  
  try {
    // Send clean format notification
    await notifier.sendNotification(testData, coverageData, options);
    console.log('âœ… Clean format notification sent!');
    
    // Also send detailed format for comparison
    console.log('\nðŸ“‹ Sending detailed format for comparison...');
    await notifier.sendDetailedNotification(testData, coverageData, options);
    console.log('âœ… Detailed format notification sent!');
    
  } catch (error) {
    console.error('âŒ Error:', error.message);
  }
}

testCleanFormat();


