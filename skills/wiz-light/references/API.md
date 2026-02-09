# Wiz-Light API Reference

## Types

### IPAdd<S>
Type representing a valid IPv4 address. Uses TypeScript conditional types to validate format.

### IColorRange
Type representing RGB values (0-255).

### IBrightnessRange
Type representing brightness levels (0-100).

### IStatus
Boolean type for light status.

### ILightProps
Properties that can be set on a light:
```typescript
{
  state?: boolean;     // ON/OFF
  r?: number;          // Red (0-255)
  g?: number;          // Green (0-255)
  b?: number;          // Blue (0-255)
  c?: number;          // Cold white (0-255)
  w?: number;          // Warm white (0-255)
  dimming?: number;    // Brightness (0-100)
}
```

### IWizLightOptions
Configuration options for the WizLight client:
```typescript
{
  port?: number;              // UDP port (default: 38899)
  statusCheckTimeout?: number; // Timeout before retry in ms (default: 1000)
  retryTimes?: number;        // Number of retry attempts (default: 5)
}
```

### IResponse
Response from a light control request:
```typescript
{
  id: number;
  method: string;
  env: string;
  result?: { success: boolean };
  error?: { code: number; message: string };
}
```

### IFullStateResponse
Complete state response from a light:
```typescript
{
  id: number;
  method: string;
  env: string;
  result: {
    mac: string;
    rssi: string;
    src: string;
    sceneId: number;
    state: boolean;
    r: IColorRange;
    g: IColorRange;
    b: IColorRange;
    c: IColorRange;
    w: IColorRange;
    dimming: IBrightnessRange;
  }
}
```

## Class: WizLight

### Constructor

```typescript
new WizLight<S extends string>(ip: IPAdd<S>, options?: IWizLightOptions)
```

**Parameters:**
- `ip`: **Required** - IP address of the Wiz light (format: 192.168.x.x)
- `options`: Optional configuration object (port is optional, defaults to 38899)

### Methods

#### setLightStatus(status: boolean): Promise<boolean>

Turn the light on or off.

**Parameters:**
- `status`: `true` to turn ON, `false` to turn OFF

**Returns:** Promise resolving to success boolean

**Example:**
```typescript
const on = await wl.setLightStatus(true);
const off = await wl.setLightStatus(false);
```

#### setLightProps(props: ILightProps): Promise<boolean>

Set light properties (color, brightness, white temperature).

**Parameters:**
- `props`: Object containing properties to set

**Returns:** Promise resolving to success boolean

**Example:**
```typescript
// RGB color
await wl.setLightProps({ r: 255, g: 0, b: 0, dimming: 100 });

// RGBW color
await wl.setLightProps({ r: 255, g: 0, b: 0, w: 0, dimming: 100 });

// White light
await wl.setLightProps({ w: 255, dimming: 50 });

// Cold white
await wl.setLightProps({ c: 255, dimming: 50 });

// Turn on with specific color
await wl.setLightProps({ r: 0, g: 255, b: 0, state: true });
```

#### getStatus(): Promise<IFullStateResponse>

Get the complete current status of the light.

**Returns:** Promise resolving to full state object

**Example:**
```typescript
const status = await wl.getStatus();
console.log(`Mac: ${status.result.mac}`);
console.log(`Brightness: ${status.result.dimming}`);
console.log(`Color: RGB(${status.result.r}, ${status.result.g}, ${status.result.b})`);
```

#### destroy(): void

Close the UDP client and clean up resources.

**Example:**
```typescript
wl.destroy();
```

## UDPReqResClient

Internal class for UDP communication. Not intended for direct use.

## Common Error Patterns

### Timeout Errors
If no response is received within `statusCheckTimeout`, the request fails and retries.

### Connection Errors
If the IP address or port is incorrect, requests fail immediately.

### Retry Mechanism
By default, requests retry up to 5 times with a 1-second timeout between attempts.
