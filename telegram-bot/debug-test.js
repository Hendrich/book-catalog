﻿#!/usr/bin/env node

/**
 * Debug Test Runner - untuk melihat data test yang sebenarnya
 */

const TelegramTestNotifier = require('./TelegramTestNotifier');

// Test data yang menyerupai Jest output
const testData = {
  numTotalTests: 334,
  numPassedTests: 334,
  numFailedTests: 0,
  numPendingTests: 0,
  testExecError: false
};

console.log('ðŸ“Š Debug - Test data being sent:');
console.log(JSON.stringify(testData, null, 2));

console.log('\nðŸ“± Creating TelegramTestNotifier...');
const notifier = new TelegramTestNotifier();

if (!notifier.enabled) {
  console.log('âš ï¸ Telegram not enabled, but let\'s check the message formatting...');
  
  // Simulate the safeTestData processing like in TelegramTestNotifier
  const safeTestData = {
    total: testData.total || testData.numTotalTests || 0,
    passed: testData.passed || testData.numPassedTests || 0,
    failed: testData.failed || testData.numFailedTests || 0,
    skipped: testData.skipped || testData.numPendingTests || 0,
    duration: testData.duration || 0,
    hasErrors: testData.hasErrors || testData.testExecError || (testData.failed > 0)
  };
  
  console.log('\nðŸ” Processed safeTestData:');
  console.log(JSON.stringify(safeTestData, null, 2));
  
  // Check status logic
  let statusIcon = 'ðŸŸ¢';
  let statusText = 'SUCCESS';
  
  if (safeTestData.failed > 0 || safeTestData.hasErrors) {
    statusIcon = 'ðŸ”´';
    statusText = 'FAILED';
  } else if (safeTestData.total === 0) {
    statusIcon = 'âšª';
    statusText = 'NO TESTS';
    console.log('âŒ PROBLEM: safeTestData.total is 0!');
  }
  
  console.log(`\nðŸ“‹ Status: ${statusIcon} ${statusText}`);
  console.log(`ðŸ“Š Total: ${safeTestData.total}, Passed: ${safeTestData.passed}, Failed: ${safeTestData.failed}`);
}


