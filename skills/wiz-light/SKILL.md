---
name: wiz-light
description: "Control Philips Wiz smart lights via Node.js library. Use when Claude needs to: (1) Create WizLight instances with IP addresses, (2) Control light status (on/off), (3) Set colors (RGB, RGBW, RGBCW), (4) Adjust brightness, (5) Retrieve light status, (6) Configure connection options (port, timeout, retries), (7) Schedule light control with node-cron, (8) Run ready-made light control scripts"
---

# Wiz-Light Skill

TypeScript library for controlling Philips Wiz smart lights via UDP communication.

## Quick Start

**CRITICAL:** Before controlling any light, ALWAYS ask the user for the IP address:
> "What is the IP address of your Wiz light?" or "Where is your Wiz light located?" or "What IP does your Wiz light use?"

### For Ready-Made Scripts

**IMPORTANT:** Scripts MUST be run from the skill's directory. Do NOT run them from outside the skill folder.

```bash
# Navigate to the skill directory first
cd wiz-light-skill

# Install dependencies
npm install

# Turn light ON
node scripts/light-on.js 192.168.1.2

# Turn light OFF
node scripts/light-off.js 192.168.1.2

# Set color with brightness
node scripts/light-color.js 192.168.1.2 38899 blue 80

# Check status
node scripts/light-status.js 192.168.1.2
```

### For Custom Scripts

**If creating custom light control scripts, I will automatically check for and set up your Node.js project if needed:**

1. Ask for your Wiz light IP address
2. Check if you have a Node.js project (check for `package.json`)
3. If NO project exists, automatically:
   - Initialize a new Node.js project in your **current directory** with `npm init -y`
   - Set `"type": "module"` in package.json
   - Install `wiz-light` library
   - (Optional) Install `node-cron` if you need scheduling
4. Create your custom script in your **current directory**
5. Provide instructions to run it from your current directory

## Using the Library

```typescript
import { WizLight } from 'wiz-light';

// Create instance with IP and port (IP must be provided)
const wl = new WizLight('192.168.1.2', { port: 38899 });

// Turn light ON
await wl.setLightStatus(true);

// Turn light OFF
await wl.setLightStatus(false);

// Set properties
await wl.setLightProps({
  r: 0,
  g: 255,
  b: 0,
  c: 0,
  w: 100,
  dimming: 100
});

// Get current status
const status = await wl.getStatus();
console.log(status.result);
```

## Color Settings

**IMPORTANT:** When calling `setLightProps()`, both `w` (warm) and `c` (cool) MUST be provided with one set to 100 and the other set to 0:
- **Warm colors**: Use `w: 100` and `c: 0`
- **Cool colors**: Use `c: 100` and `w: 0`

This ensures only one channel is active for clear color representation.

## Configuration Options

```typescript
const wl = new WizLight('192.168.1.2', {
  // Port number (default: 38899)
  port: 38899,

  // Time to wait before retrying in ms (default: 1000)
  statusCheckTimeout: 1000,

  // Number of retry attempts (default: 5)
  retryTimes: 5
});
```

## Scheduling Light Control

Use `node-cron` to schedule automatic light control. **Use the library directly for scheduling** - scripts are not suitable for scheduled tasks.

```typescript
import { WizLight } from 'wiz-light';
import cron from 'node-cron';

const wl = new WizLight('192.168.1.2', { port: 38899 });

// Schedule light to turn ON every day at 6:00 AM
cron.schedule('0 6 * * *', async () => {
  await wl.setLightStatus(true);
});

// Schedule light to turn OFF every day at 10:00 PM
cron.schedule('0 22 * * *', async () => {
  await wl.setLightStatus(false);
});
```

See [references/scheduling.md](references/scheduling.md) for complete scheduling examples including:
- Daily routines
- Weekday vs weekend schedules
- Work hours automation
- Color cycling
- Multiple light control
- Error handling and cleanup

## API Reference

See [references/API.md](references/API.md) for complete API documentation including all types and methods.

## Usage Examples

See [references/examples.md](references/examples.md) for common use cases and patterns.

## Ready-Made Scripts

The skill includes ready-made scripts for quick light control. **When the user wants to perform a direct action, first ask for the IP address, then use these scripts.**

### Available Scripts

- `scripts/light-on.js` - Turn light ON with specified color (default: white)
- `scripts/light-off.js` - Turn light OFF
- `scripts/light-color.js` - Set light to specific color
- `scripts/light-status.js` - Check current light status

### Running Scripts

**IMPORTANT:** Scripts MUST be run from the skill's directory. Do NOT run them from outside the skill folder.

```bash
# Navigate to the skill directory first
cd wiz-light-skill

# Install dependencies
npm install

# Turn on light with default white color
node scripts/light-on.js 192.168.1.2

# Turn on light with custom color and brightness
node scripts/light-on.js 192.168.1.2 38899 red 100

# Turn off light
node scripts/light-off.js 192.168.1.2

# Set specific color
node scripts/light-color.js 192.168.1.2 38899 blue 80

# Check status
node scripts/light-status.js 192.168.1.2
```

**CRITICAL:**
- IP address is REQUIRED for all scripts
- Port is optional (default: 38899)
- Scripts MUST be run from the skill's directory (where package.json and scripts folder are located)

### When to Use Scripts vs. Writing Code

**Use READY-MADE scripts for:**
- Simple, one-time light control actions
- Quick color changes
- Turning lights on/off
- User wants immediate results without coding
- Testing light control quickly

**Use the LIBRARY for:**
- Complex automation and scheduling
- Integrating with other systems
- Repeated automated tasks
- Building custom applications
- Creating custom scripts with specific requirements

## Auto-Setup for New Projects

**If creating custom light control scripts and don't have a Node.js project, I will automatically:**

1. Check if you have a Node.js project (check for `package.json`)
2. If NO project exists:
   - Initialize a new Node.js project in your **current directory** with `npm init -y`
   - Set `"type": "module"` in package.json (for ES module imports)
   - Install `wiz-light` library
   - (Optional) Install `node-cron` if you need scheduling
3. Create your custom script in your **current directory**
4. Once set up, proceed with your script creation

## Documentation

- **[references/API.md](references/API.md)** - Complete API documentation
- **[references/examples.md](references/examples.md)** - Common use cases
- **[references/scheduling.md](references/scheduling.md)** - Scheduling with node-cron

