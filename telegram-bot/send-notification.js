#!/usr/bin/env node

/**
 * Send Telegram Notification After Jest Tests
 * This script reads coverage data and sends notification to Telegram
 */

require('dotenv').config();
const TelegramTestNotifier = require('./TelegramTestNotifier');
const fs = require('fs');
const path = require('path');

async function sendTestNotification() {
  console.log('ðŸ“¤ Sending test coverage notification to Telegram...');
  
  const notifier = new TelegramTestNotifier();
  
  if (!notifier.enabled) {
    console.log('âš ï¸ Telegram notifications disabled (missing credentials)');
    return;
  }
  
  try {
    // Read coverage data
    const coveragePath = path.join(process.cwd(), 'coverage', 'coverage-summary.json');
    let coverageData = null;
    
    if (fs.existsSync(coveragePath)) {
      const rawCoverage = fs.readFileSync(coveragePath, 'utf8');
      const coverage = JSON.parse(rawCoverage);
      coverageData = coverage.total;
      console.log('ðŸ“Š Coverage data loaded successfully');
    } else {
      console.log('âš ï¸ No coverage data found, sending basic notification');
    }
    
    // Read real test results from Jest JSON output
    const testResultsPath = path.join(process.cwd(), 'test-results.json');
    let testData = {
      numTotalTests: 0,
      numPassedTests: 0,
      numFailedTests: 0,
      numPendingTests: 0,
      testExecError: false
    };
    
    if (fs.existsSync(testResultsPath)) {
      try {
        const rawTestResults = fs.readFileSync(testResultsPath, 'utf8');
        const testResults = JSON.parse(rawTestResults);
        
        // Jest JSON reporter format
        if (testResults.numTotalTests !== undefined) {
          testData = {
            numTotalTests: testResults.numTotalTests,
            numPassedTests: testResults.numPassedTests,
            numFailedTests: testResults.numFailedTests,
            numPendingTests: testResults.numPendingTests,
            testExecError: testResults.success === false
          };
        }
        console.log('ðŸ“‹ Test results loaded successfully');
        console.log(`ðŸ“Š Tests: ${testData.numTotalTests}, Passed: ${testData.numPassedTests}, Failed: ${testData.numFailedTests}`);
        
        // Clean up the temporary file
        fs.unlinkSync(testResultsPath);
      } catch (error) {
        console.warn('âš ï¸ Failed to read test results, using defaults:', error.message);
      }
    } else {
      console.log('âš ï¸ No test results found, using default values');
    }
    
    // Enhanced options with GitHub Actions context
    const options = {
      projectName: 'lab Catalog App',
      branch: process.env.GIT_BRANCH || process.env.GITHUB_REF_NAME || 'main',
      author: process.env.GIT_AUTHOR || process.env.GITHUB_ACTOR || 'Automated',
      timestamp: new Date(),
      // GitHub Actions specific context
      githubContext: {
        repository: process.env.GITHUB_REPOSITORY,
        runId: process.env.GITHUB_RUN_ID,
        serverUrl: process.env.GITHUB_SERVER_URL,
        commit: process.env.GIT_COMMIT || process.env.GITHUB_SHA,
        workflow: process.env.GITHUB_WORKFLOW || 'CI/CD'
      }
    };
    
    await notifier.sendNotification(testData, coverageData, options);
    console.log('âœ… Telegram notification sent successfully!');
    
  } catch (error) {
    console.error('âŒ Failed to send Telegram notification:', error.message);
    console.error('ðŸ”§ Please check your Telegram bot configuration in .env file');
    process.exit(1);
  }
}

// Only run if called directly
if (require.main === module) {
  sendTestNotification();
}

module.exports = sendTestNotification;


