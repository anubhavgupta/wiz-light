#!/usr/bin/env node

/**
 * Wiz-Light: Set Light Color
 *
 * This script sets a Wiz light to a specific color.
 *
 * Usage:
 *   node light-color.js [ip] [port] [color] [brightness]
 *
 * Colors:
 *   white, warm, cold, red, green, blue, yellow, cyan, magenta
 */

import { WizLight } from 'wiz-light';

// Default values
const DEFAULT_PORT = 38899;
const DEFAULT_COLOR = 'white';
const DEFAULT_DIMMING = 80;

// Parse command line arguments
const ipArg = process.argv[2];
const ip = ipArg || '192.168.1.2';

const portArg = process.argv[3];
const port = portArg === '-1' ? DEFAULT_PORT : parseInt(portArg) || DEFAULT_PORT;

const colorArg = process.argv[4];
const color = colorArg || DEFAULT_COLOR;

const dimming = parseInt(process.argv[5]) || DEFAULT_DIMMING;

// Color mapping
const colorMap = {
  white: { w: 255, c: 0 },
  warm: { w: 255, c: 0 },
  cold: { c: 255, w: 0 },
  red: { r: 255, g: 0, b: 0 },
  green: { r: 0, g: 255, b: 0 },
  blue: { r: 0, g: 0, b: 255 },
  yellow: { r: 255, g: 255, b: 0 },
  cyan: { r: 0, g: 255, b: 255 },
  magenta: { r: 255, g: 0, b: 255 },
  orange: { r: 255, g: 165, b: 0 },
  pink: { r: 255, g: 192, b: 203 },
  purple: { r: 128, g: 0, b: 128 }
};

// Validate IP - MUST be provided
if (!ip || ip === '192.168.1.2') {
  console.error('Error: IP address is required.');
  console.error('Usage: node light-color.js [ip] [port] [color] [brightness]');
  console.error('Example: node light-color.js 192.168.1.2 38899 red 80');
  console.error('\nPlease provide the IP address of your Wiz light.');
  process.exit(1);
}

// Validate port
if (port !== -1 && (isNaN(port) || port < 1 || port > 65535)) {
  console.error(`Error: Invalid port number '${port}'. Port must be between 1-65535 or -1 for default.`);
  console.error(`Usage: node light-color.js [ip] [port] [color] [brightness]`);
  console.error(`Example: node light-color.js 192.168.1.2 38899 red 80`);
  process.exit(1);
}

// Validate color
const lightColor = colorMap[color.toLowerCase()];
if (!lightColor) {
  console.error(`Error: Unknown color '${color}'. Available colors: ${Object.keys(colorMap).join(', ')}`);
  console.error(`Usage: node light-color.js [ip] [port] [color] [brightness]`);
  console.error(`Example: node light-color.js 192.168.1.2 38899 red 80`);
  process.exit(1);
}

// Create WizLight instance
const wl = new WizLight(ip, {
  port: port,
  statusCheckTimeout: 1000,
  retryTimes: 5
});

async function setColor() {
  try {
    console.log(`\nSetting light at ${ip} to ${color} color at ${dimming}% brightness...`);

    // Build color props
    const colorProps = { ...lightColor, dimming };

    // Set light properties
    const success = await wl.setLightProps(colorProps);

    if (success) {
      console.log(`✅ Color set successfully!`);
      console.log(`   IP: ${ip}`);
      console.log(`   Port: ${port}`);
      console.log(`   Color: ${color}`);
      console.log(`   Brightness: ${dimming}%`);
    } else {
      console.log(`❌ Failed to set color`);
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

setColor();
