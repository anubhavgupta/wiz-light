#!/usr/bin/env node

/**
 * Wiz-Light: Check Light Status
 *
 * This script checks the current status of a Wiz light.
 *
 * Usage:
 *   node light-status.js [ip] [port]
 */

import { WizLight } from 'wiz-light';

// Default values
const DEFAULT_PORT = 38899;

// Parse command line arguments
const ipArg = process.argv[2];
const ip = ipArg || '192.168.1.2';

const portArg = process.argv[3];
const port = portArg === '-1' ? DEFAULT_PORT : parseInt(portArg) || DEFAULT_PORT;

// Validate IP - MUST be provided
if (!ip || ip === '192.168.1.2') {
  console.error('Error: IP address is required.');
  console.error('Usage: node light-status.js [ip] [port]');
  console.error('Example: node light-status.js 192.168.1.2 38899');
  console.error('\nPlease provide the IP address of your Wiz light.');
  process.exit(1);
}

// Validate port
if (port !== -1 && (isNaN(port) || port < 1 || port > 65535)) {
  console.error(`Error: Invalid port number '${port}'. Port must be between 1-65535 or -1 for default.`);
  console.error(`Usage: node light-status.js [ip] [port]`);
  console.error(`Example: node light-status.js 192.168.1.2 38899`);
  process.exit(1);
}

// Create WizLight instance
const wl = new WizLight(ip, {
  port: port,
  statusCheckTimeout: 1000,
  retryTimes: 5
});

async function checkStatus() {
  try {
    console.log(`\n📊 Checking status of light at ${ip}...\n`);

    const status = await wl.getStatus();

    if (status && status.result) {
      const result = status.result;
      console.log('✅ Light status:');
      console.log(`   State: ${result.state ? 'ON' : 'OFF'}`);
      console.log(`   Dimming: ${result.dimming || 0}%`);
      if (result.r !== undefined || result.g !== undefined || result.b !== undefined) {
        console.log(`   RGB: R=${result.r || 0}, G=${result.g || 0}, B=${result.b || 0}`);
      }
      if (result.w !== undefined || result.c !== undefined) {
        console.log(`   White/Cold: W=${result.w || 0}, C=${result.c || 0}`);
      }
    } else {
      console.log('❌ Failed to get status');
    }

  } catch (error) {
    console.error(`❌ Error: ${error.message}`);
    console.error('\nTroubleshooting tips:');
    console.error('1. Check if the IP address is correct:', ip);
    console.error('2. Check if the port is correct:', port);
    console.error('3. Ensure the light is powered on and connected to WiFi');
    console.error('4. Check if your router shows the light at the specified IP');
  } finally {
    wl.destroy();
  }
}

checkStatus();
