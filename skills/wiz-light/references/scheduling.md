# Wiz-Light Scheduling with node-cron

## Installation

Install the `node-cron` library:
```bash
npm install node-cron
```

## Basic Scheduling

### Schedule Light On/Off

```typescript
import { WizLight } from 'wiz-light';
import cron from 'node-cron';

const wl = new WizLight('192.168.1.2', { port: 38899 });

// Turn ON every day at 6:00 AM
cron.schedule('0 6 * * *', async () => {
  await wl.setLightStatus(true);
});

// Turn OFF every day at 10:00 PM
cron.schedule('0 22 * * *', async () => {
  await wl.setLightStatus(false);
});
```

### Schedule Color Changes

```typescript
// Turn on with warm color at 7:00 AM
cron.schedule('0 7 * * *', async () => {
  await wl.setLightProps({
    r: 255,
    g: 200,
    b: 100,
    dimming: 80,
    state: true
  });
});

// Turn on with cool color at 5:00 PM
cron.schedule('0 17 * * *', async () => {
  await wl.setLightProps({
    r: 100,
    g: 150,
    b: 255,
    dimming: 70,
    state: true
  });
});
```

## Cron Expression Syntax

### Format: `minute hour day-of-month month day-of-week`

Examples:
- `0 6 * * *` - Every day at 6:00 AM
- `0 22 * * *` - Every day at 10:00 PM
- `*/30 * * * *` - Every 30 minutes
- `0 7,19 * * *` - Every day at 7:00 AM and 7:00 PM
- `0 8-18 * * 1-5` - Weekdays (Mon-Fri) between 8:00 AM and 6:00 PM

## Common Schedules

### Daily Routines

```typescript
// Morning routine: Turn on with warm light at 7:00 AM
cron.schedule('0 7 * * *', async () => {
  await wl.setLightProps({
    r: 255,
    g: 220,
    b: 150,
    dimming: 60,
    state: true
  });
});

// Evening routine: Dim lights at 9:00 PM
cron.schedule('0 21 * * *', async () => {
  await wl.setLightProps({
    dimming: 30
  });
});

// Bedtime: Turn off at 11:00 PM
cron.schedule('0 23 * * *', async () => {
  await wl.setLightStatus(false);
});
```

### Weekday vs Weekend Schedules

```typescript
// Weekdays: Turn on at 7:00 AM
cron.schedule('0 7 * * 1-5', async () => {
  await wl.setLightProps({
    r: 200,
    g: 200,
    b: 255,
    dimming: 80,
    state: true
  });
});

// Weekends: Turn on at 9:00 AM
cron.schedule('0 9 * * 0,6', async () => {
  await wl.setLightProps({
    r: 255,
    g: 200,
    b: 150,
    dimming: 70,
    state: true
  });
});

// Turn off at 10:00 PM every day
cron.schedule('0 22 * * *', async () => {
  await wl.setLightStatus(false);
});
```

### Work Hours Schedule

```typescript
const wl = new WizLight('192.168.1.2', { port: 38899 });

// Morning: Turn on at 8:00 AM
cron.schedule('0 8 * * 1-5', async () => {
  await wl.setLightProps({
    r: 255,
    g: 255,
    b: 200,
    dimming: 100,
    state: true
  });
});

// Lunch break: Dim lights at 12:00 PM
cron.schedule('0 12 * * 1-5', async () => {
  await wl.setLightProps({
    dimming: 50
  });
});

// Afternoon: Restore brightness at 2:00 PM
cron.schedule('0 14 * * 1-5', async () => {
  await wl.setLightProps({
    dimming: 100
  });
});

// Evening: Turn on warm light at 6:00 PM
cron.schedule('0 18 * * 1-5', async () => {
  await wl.setLightProps({
    r: 255,
    g: 180,
    b: 100,
    dimming: 90,
    state: true
  });
});

// Turn off at 11:00 PM
cron.schedule('0 23 * * 1-5', async () => {
  await wl.setLightStatus(false);
});
```

### Color Cycling Schedule

```typescript
// Cycle colors every hour
const wl = new WizLight('192.168.1.2', { port: 38899 });

const colors = [
  { r: 255, g: 0, b: 0 },
  { r: 0, g: 255, b: 0 },
  { r: 0, g: 0, b: 255 },
  { r: 255, g: 255, b: 0 }
];

let colorIndex = 0;

function cycleColor() {
  const color = colors[colorIndex];
  wl.setLightProps({
    ...color,
    state: true
  });
  colorIndex = (colorIndex + 1) % colors.length;
}

// Change color every hour
cron.schedule('0 * * * *', cycleColor);

// Turn off at 11:00 PM
cron.schedule('0 23 * * *', async () => {
  await wl.setLightStatus(false);
});
```

## Advanced Scheduling

### Conditional Scheduling

```typescript
const wl = new WizLight('192.168.1.2', { port: 38899 });

// Check current status before making changes
cron.schedule('0 */2 * * *', async () => {
  const status = await wl.getStatus();

  if (status.result.state) {
    // Only dim if light is currently on
    await wl.setLightProps({
      dimming: 50
    });
  }
});
```

### Multiple Lights

```typescript
import { WizLight } from 'wiz-light';
import cron from 'node-cron';

const lights = {
  bedroom: new WizLight('192.168.1.10', { port: 38899 }),
  livingRoom: new WizLight('192.168.1.11', { port: 38899 })
};

// Turn on all lights at 6:00 AM
cron.schedule('0 6 * * *', async () => {
  await Promise.all([
    lights.bedroom.setLightStatus(true),
    lights.livingRoom.setLightStatus(true)
  ]);
});

// Turn off all lights at 11:00 PM
cron.schedule('0 23 * * *', async () => {
  await Promise.all([
    lights.bedroom.setLightStatus(false),
    lights.livingRoom.setLightStatus(false)
  ]);
});
```

### Temperature-Based Scheduling

```typescript
const wl = new WizLight('192.168.1.2', { port: 38899 });

// Cold white for morning (7:00 AM)
cron.schedule('0 7 * * *', async () => {
  await wl.setLightProps({
    c: 255,
    dimming: 70,
    state: true
  });
});

// Warm white for evening (6:00 PM)
cron.schedule('0 18 * * *', async () => {
  await wl.setLightProps({
    w: 255,
    dimming: 80,
    state: true
  });
});

// Cool white for late night (11:00 PM)
cron.schedule('0 23 * * *', async () => {
  await wl.setLightProps({
    c: 200,
    dimming: 30
  });
});
```

## Cleanup and Best Practices

### Proper Cleanup

```typescript
import { WizLight } from 'wiz-light';
import cron from 'node-cron';

const wl = new WizLight('192.168.1.2', { port: 38899 });

// Schedule setup
const tasks = [
  cron.schedule('0 6 * * *', async () => {
    await wl.setLightStatus(true);
  }),
  cron.schedule('0 23 * * *', async () => {
    await wl.setLightStatus(false);
    wl.destroy(); // Clean up when done
  })
];

// Graceful shutdown
process.on('SIGINT', () => {
  tasks.forEach(task => task.stop());
  wl.destroy();
  process.exit(0);
});
```

### Error Handling

```typescript
const wl = new WizLight('192.168.1.2', { port: 38899 });

// Schedule with error handling
cron.schedule('0 6 * * *', async () => {
  try {
    await wl.setLightStatus(true);
    console.log('Light turned ON successfully');
  } catch (error) {
    console.error('Failed to turn on light:', error);
  }
});
```

### Preventing Duplicate Schedules

```typescript
let isScheduleRunning = false;

const wl = new WizLight('192.168.1.2', { port: 38899 });

function startSchedule() {
  if (isScheduleRunning) return;

  isScheduleRunning = true;

  // Turn on at 6:00 AM
  cron.schedule('0 6 * * *', async () => {
    try {
      await wl.setLightStatus(true);
    } catch (error) {
      console.error('Schedule error:', error);
    }
  });

  // Turn off at 11:00 PM
  cron.schedule('0 23 * * *', async () => {
    try {
      await wl.setLightStatus(false);
      isScheduleRunning = false;
    } catch (error) {
      console.error('Schedule error:', error);
    }
  });
}

startSchedule();
```

## Reference: Cron Schedule Syntax

### Special Characters

- `*` - Matches any value
- `?` - Equivalent to `*` (used for day-of-week and day-of-month)
- `-` - Range (e.g., `5-10` means 5, 6, 7, 8, 9, 10)
- `,` - Lists multiple values (e.g., `MON,WED,FRI`)

### Field Order

1. **Minute**: `0-59`
2. **Hour**: `0-23`
3. **Day of Month**: `1-31`
4. **Month**: `0-11` (0 = January, 11 = December) or `JAN,FEB,MAR,...`
5. **Day of Week**: `0-6` (0 = Sunday, 6 = Saturday) or `SUN,MON,TUE,...`

### Common Patterns

- `0 6 * * *` - Every day at 6:00
- `0 6 * * 1-5` - Weekdays at 6:00
- `0 22 * * *` - Every day at 10:00 PM
- `*/30 * * * *` - Every 30 minutes
- `0 0 * * 0` - Every Sunday at midnight
- `0 7,19 * * *` - Every day at 7:00 AM and 7:00 PM
- `0 8-18 * * 1-5` - Weekdays 8 AM - 6 PM
- `0 0 1 * *` - First day of every month at midnight
