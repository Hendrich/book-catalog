#!/usr/bin/env node

/**
 * Test Jest JSON output parsing
 */

const { spawn } = require('child_process');

async function testJestJsonOutput() {
    console.log('🧪 Testing Jest JSON output parsing...');
    
    try {
        const result = await new Promise((resolve, reject) => {
            const jest = spawn('npx', ['jest', '--json', '--passWithNoTests', '--silent'], {
                stdio: ['inherit', 'pipe', 'pipe'],
                shell: true
            });
            
            let jsonOutput = '';
            let errorOutput = '';
            
            jest.stdout.on('data', (data) => {
                jsonOutput += data.toString();
            });
            
            jest.stderr.on('data', (data) => {
                errorOutput += data.toString();
            });
            
            jest.on('close', (code) => {
                resolve({ code, jsonOutput, errorOutput });
            });
            
            jest.on('error', (error) => {
                reject(error);
            });
        });
        
        console.log('✅ Jest finished with exit code:', result.code);
        console.log('📄 JSON output length:', result.jsonOutput.length);
        console.log('📄 Error output length:', result.errorOutput.length);
        
        // Try to find JSON in output
        const lines = result.jsonOutput.split('\n');
        console.log('📄 Total lines:', lines.length);
        
        let jsonLine = '';
        for (const line of lines) {
            if (line.trim().startsWith('{') && line.includes('numTotalTests')) {
                jsonLine = line.trim();
                console.log('✅ Found JSON line');
                break;
            }
        }
        
        if (jsonLine) {
            try {
                const testResults = JSON.parse(jsonLine);
                console.log('📊 Parsed test results:');
                console.log('- numTotalTests:', testResults.numTotalTests);
                console.log('- numPassedTests:', testResults.numPassedTests);
                console.log('- numFailedTests:', testResults.numFailedTests);
                console.log('- numPendingTests:', testResults.numPendingTests);
            } catch (parseError) {
                console.error('❌ JSON parse error:', parseError.message);
                console.log('📄 JSON line:', jsonLine.substring(0, 200));
            }
        } else {
            console.log('❌ No JSON line found');
            console.log('📄 First few lines:');
            for (let i = 0; i < Math.min(5, lines.length); i++) {
                console.log(`${i}: ${lines[i].substring(0, 100)}`);
            }
        }
        
    } catch (error) {
        console.error('❌ Test failed:', error.message);
    }
}

testJestJsonOutput();
