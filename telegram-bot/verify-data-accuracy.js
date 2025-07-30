#!/usr/bin/env node

/**
 * Test Data Accuracy - Compare Terminal Output vs Telegram Message
 * This script verifies that Telegram notification matches terminal output
 */

require('dotenv').config();
const { execSync } = require('child_process');
const TelegramTestNotifier = require('./TelegramTestNotifier');
const fs = require('fs');
const path = require('path');

async function verifyDataAccuracy() {
  console.log('🔍 VERIFYING DATA ACCURACY');
  console.log('=========================\n');
  
  console.log('1️⃣ Running Jest and capturing real output...');
  
  let jestOutput = '';
  let realTestData = {
    total: 0,
    passed: 0,
    failed: 0,
    skipped: 0,
    duration: 0,
    hasErrors: false
  };
  
  try {
    // Run Jest and capture output
    jestOutput = execSync('npx jest --coverage --verbose', {
      encoding: 'utf8',
      stdio: 'pipe'
    });
    
    console.log('📊 Jest Output (last 10 lines):');
    const lines = jestOutput.split('\n');
    lines.slice(-10).forEach(line => {
      if (line.trim()) console.log(`   ${line}`);
    });
    
  } catch (error) {
    jestOutput = error.stdout || error.message;
    realTestData.hasErrors = true;
    console.log('⚠️ Jest failed, using error output for parsing');
  }
  
  console.log('\n2️⃣ Parsing Jest output...');
  
  // Parse test results from Jest output
  const patterns = [
    // "Tests: 334 passed, 334 total"
    /Tests:\s+(\d+)\s+passed,\s+(\d+)\s+total/,
    // "Tests: 2 failed, 332 passed, 334 total"
    /Tests:\s+(\d+)\s+failed,\s+(\d+)\s+passed,\s+(\d+)\s+total/
  ];
  
  let parsed = false;
  for (const pattern of patterns) {
    const match = jestOutput.match(pattern);
    if (match && !parsed) {
      if (match.length === 3) { // All passed
        realTestData.passed = parseInt(match[1]);
        realTestData.total = parseInt(match[2]);
        realTestData.failed = 0;
      } else if (match.length === 4) { // Some failed
        realTestData.failed = parseInt(match[1]);
        realTestData.passed = parseInt(match[2]);
        realTestData.total = parseInt(match[3]);
      }
      parsed = true;
      break;
    }
  }
  
  // Parse duration
  const timeMatch = jestOutput.match(/Time:\s+(\d+(?:\.\d+)?)\s*s/);
  if (timeMatch) {
    realTestData.duration = Math.round(parseFloat(timeMatch[1]) * 1000);
  }
  
  console.log('📋 Parsed Test Data:');
  console.log(`   ├─ Total: ${realTestData.total}`);
  console.log(`   ├─ Passed: ${realTestData.passed}`);
  console.log(`   ├─ Failed: ${realTestData.failed}`);
  console.log(`   ├─ Duration: ${realTestData.duration}ms`);
  console.log(`   └─ Has Errors: ${realTestData.hasErrors}`);
  
  console.log('\n3️⃣ Reading coverage data...');
  
  let coverageData = null;
  const coveragePath = path.join(process.cwd(), 'coverage', 'coverage-summary.json');
  
  if (fs.existsSync(coveragePath)) {
    const rawCoverage = fs.readFileSync(coveragePath, 'utf8');
    const coverage = JSON.parse(rawCoverage);
    coverageData = coverage.total;
    
    console.log('📊 Coverage Data:');
    console.log(`   ├─ Statements: ${coverageData.statements.pct.toFixed(2)}%`);
    console.log(`   ├─ Branches: ${coverageData.branches.pct.toFixed(2)}%`);
    console.log(`   ├─ Functions: ${coverageData.functions.pct.toFixed(2)}%`);
    console.log(`   └─ Lines: ${coverageData.lines.pct.toFixed(2)}%`);
  } else {
    console.log('⚠️ No coverage data found');
  }
  
  console.log('\n4️⃣ Generating Telegram message...');
  
  const notifier = new TelegramTestNotifier();
  const options = {
    projectName: 'Book Catalog App',
    branch: process.env.GIT_BRANCH || 'main',
    author: process.env.GIT_AUTHOR || 'Data Verification',
    timestamp: new Date()
  };
  
  // Generate message (but don't send yet)
  const telegramMessage = notifier.formatCleanMessage(realTestData, coverageData, options);
  
  console.log('📱 Generated Telegram Message:');
  console.log('--- BEGIN MESSAGE ---');
  console.log(telegramMessage);
  console.log('--- END MESSAGE ---');
  
  console.log('\n5️⃣ Data verification...');
  
  // Verify data matches
  const messageLines = telegramMessage.split('\n');
  const testsLine = messageLines.find(line => line.includes('Tests ='));
  const passesLine = messageLines.find(line => line.includes('Passes ='));
  const failuresLine = messageLines.find(line => line.includes('Failures ='));
  const durationLine = messageLines.find(line => line.includes('Duration ='));
  
  let verification = {
    testsMatch: testsLine ? testsLine.includes(realTestData.total.toString()) : false,
    passesMatch: passesLine ? passesLine.includes(realTestData.passed.toString()) : false,
    failuresMatch: failuresLine ? failuresLine.includes(realTestData.failed.toString()) : false,
    durationMatch: durationLine ? durationLine.includes(realTestData.duration.toString()) : false
  };
  
  console.log('✅ Verification Results:');
  console.log(`   ├─ Tests count: ${verification.testsMatch ? '✅ Match' : '❌ Mismatch'}`);
  console.log(`   ├─ Passes count: ${verification.passesMatch ? '✅ Match' : '❌ Mismatch'}`);
  console.log(`   ├─ Failures count: ${verification.failuresMatch ? '✅ Match' : '❌ Mismatch'}`);
  console.log(`   └─ Duration: ${verification.durationMatch ? '✅ Match' : '❌ Mismatch'}`);
  
  const allMatch = Object.values(verification).every(v => v === true);
  
  if (allMatch) {
    console.log('\n🎉 VERIFICATION PASSED!');
    console.log('✅ Telegram message data matches terminal output perfectly.');
    
    // Ask if user wants to send the verified message
    console.log('\n6️⃣ Sending verified message to Telegram...');
    if (notifier.enabled) {
      await notifier.sendNotification(realTestData, coverageData, options);
      console.log('✅ Accurate message sent to Telegram!');
    } else {
      console.log('⚠️ Telegram not configured, message not sent');
    }
  } else {
    console.log('\n❌ VERIFICATION FAILED!');
    console.log('⚠️ Data mismatch detected. Check parsing logic.');
  }
}

// Run verification
verifyDataAccuracy().catch(console.error);
