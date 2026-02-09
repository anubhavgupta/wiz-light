# Wiz-Light Usage Examples

## Basic Setup

### Import and Initialize
```typescript
import { WizLight } from 'wiz-light';

// Provide IP address and port (default port is 38899)
const wl = new WizLight('192.168.1.2', { port: 38899 });
```

### With Custom Configuration
```typescript
import { WizLight } from 'wiz-light';

const wl = new WizLight('192.168.1.2', {
  port: 38899,
  statusCheckTimeout: 1500,
  retryTimes: 3
});
```

## Light Control Examples

### Turn Light On/Off
```typescript
// Turn on
await wl.setLightStatus(true);

// Turn off
await wl.setLightStatus(false);
```

### Set RGB Color
```typescript
await wl.setLightProps({
  r: 255,
  g: 0,
  b: 0,
  dimming: 100
});
```

### Set RGBW Color
```typescript
await wl.setLightProps({
  r: 255,
  g: 0,
  b: 0,
  w: 0,
  dimming: 80
});
```

### Set White Light
```typescript
// Warm white
await wl.setLightProps({
  w: 255,
  dimming: 50
});

// Cold white
await wl.setLightProps({
  c: 255,
  dimming: 50
});
```

### Set Color Temperature
```typescript
// Mix cold and warm white
await wl.setLightProps({
  c: 128,
  w: 128,
  dimming: 75
});
```

### Set Brightness Only
```typescript
await wl.setLightProps({
  dimming: 50
});
```

## Advanced Examples

### Get and Display Light Status
```typescript
const status = await wl.getStatus();

console.log('Light Status:');
console.log(`  MAC Address: ${status.result.mac}`);
console.log(`  State: ${status.result.state ? 'ON' : 'OFF'}`);
console.log(`  Brightness: ${status.result.dimming}%`);
console.log(`  Color: RGB(${status.result.r}, ${status.result.g}, ${status.result.b})`);
console.log(`  Cold White: ${status.result.c}`);
console.log(`  Warm White: ${status.result.w}`);
console.log(`  RSSI: ${status.result.rssi}`);
```

### Turn On with Specific Color
```typescript
await wl.setLightProps({
  r: 0,
  g: 255,
  b: 0,
  state: true
});
```

### Create Color Presets
```typescript
const presets = {
  red: { r: 255, g: 0, b: 0 },
  green: { r: 0, g: 255, b: 0 },
  blue: { r: 0, g: 0, b: 255 },
  white: { w: 255, dimming: 100 },
  warm: { w: 255, dimming: 75 },
  cold: { c: 255, dimming: 75 }
};

async function setColor(preset: keyof typeof presets) {
  await wl.setLightProps({ ...presets[preset], state: true });
}

// Usage
await setColor('red');
await setColor('warm');
```

### Color Cycling Effect
```typescript
async function cycleColor() {
  const colors = [
    { r: 255, g: 0, b: 0 },
    { r: 0, g: 255, b: 0 },
    { r: 0, g: 0, b: 255 },
    { r: 255, g: 255, b: 0 }
  ];

  for (const color of colors) {
    await wl.setLightProps({ ...color, state: true });
    await new Promise(resolve => setTimeout(resolve, 2000));
  }
}

await cycleColor();
```

## Integration Examples

### With Node.js Event Loop
```typescript
import { WizLight } from 'wiz-light';

// Provide IP and port (required)
const wl = new WizLight('192.168.1.2', { port: 38899 });

async function setupScene() {
  await wl.setLightProps({
    r: 255,
    g: 165,
    b: 0,  // Orange
    dimming: 100,
    state: true
  });

  // Cleanup
  wl.destroy();
}

setupScene();
```

### With Express API
```typescript
import express from 'express';
import { WizLight } from 'wiz-light';

const app = express();
// Provide IP and port (required)
const wl = new WizLight('192.168.1.2', { port: 38899 });

app.get('/api/light/on', async (req, res) => {
  try {
    await wl.setLightStatus(true);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ success: false, error });
  }
});

app.get('/api/light/color', async (req, res) => {
  try {
    const { r, g, b, dimming } = req.query;
    await wl.setLightProps({
      r: parseInt(r as string),
      g: parseInt(g as string),
      b: parseInt(b as string),
      dimming: parseInt(dimming as string),
      state: true
    });
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ success: false, error });
  }
});

app.listen(3000);
```

### With Home Automation
```typescript
import { WizLight } from 'wiz-light';

const lights = {
  bedroom: new WizLight('192.168.1.10', { port: 38899 }),
  livingRoom: new WizLight('192.168.1.11', { port: 38899 }),
  kitchen: new WizLight('192.168.1.12', { port: 38899 })
};

async function turnOnAllLights() {
  const promises = Object.values(lights).map(wl => wl.setLightStatus(true));
  await Promise.all(promises);
}

async function setBedroomColor() {
  await lights.bedroom.setLightProps({
    r: 100,
    g: 50,
    b: 200,
    dimming: 80
  });
}

async function dimAllLights() {
  const promises = Object.values(lights).map(wl =>
    wl.setLightProps({ dimming: 30 })
  );
  await Promise.all(promises);
}
```

## Error Handling

### Try-Catch Pattern
```typescript
try {
  await wl.setLightProps({ r: 255, g: 0, b: 0 });
  console.log('Color set successfully');
} catch (error) {
  console.error('Failed to set color:', error);
  // Handle error - check IP, retry, etc.
}
```

### Check Response
```typescript
const response = await wl.setLightProps({
  r: 255,
  g: 0,
  b: 0
});

if (response) {
  console.log('Success');
} else {
  console.log('Failed');
}
```

## Cleanup

### Proper Resource Cleanup
```typescript
import { WizLight } from 'wiz-light';

const wl = new WizLight('192.168.1.2');

try {
  await wl.setLightStatus(true);
  // ... other operations
} finally {
  wl.destroy();  // Always clean up
}
```
