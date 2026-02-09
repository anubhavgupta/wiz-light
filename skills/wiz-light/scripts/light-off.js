#!/usr/bin/env node

/**
 * Wiz-Light: Turn Light OFF
 *
 * This script turns off a Wiz light.
 *
 * Usage:
 *   node light-off.js [ip] [port]
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
  console.error('Usage: node light-off.js [ip] [port]');
  console.error('Example: node light-off.js 192.168.1.2 38899');
  console.error('\nPlease provide the IP address of your Wiz light.');
  process.exit(1);
}

// Validate port
if (port !== -1 && (isNaN(port) || port < 1 || port > 65535)) {
  console.error(`Error: Invalid port number '${port}'. Port must be between 1-65535 or -1 for default.`);
  console.error(`Usage: node light-off.js [ip] [port]`);
  console.error(`Example: node light-off.js 192.168.1.2 38899`);
  process.exit(1);
}

// Create WizLight instance
const wl = new WizLight(ip, {
  port: port,
  statusCheckTimeout: 1000,
  retryTimes: 5
});

async function turnOffLight() {
  try {
    console.log(`\nTurning off light at ${ip}...\n`);

    // Turn off light
    const success = await wl.setLightStatus(false);

    if (success) {
      console.log('✅ Light turned OFF successfully!');
      console.log(`   IP: ${ip}`);
      console.log(`   Port: ${port}`);
    } else {
      console.log('❌ Failed to turn off light');
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

turnOffLight();
