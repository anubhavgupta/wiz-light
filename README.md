# Wiz-light

A small and quick library to control your wiz based lights via javascript.


npm install instructions:
```sh
npm install wiz-light --save
```


Quick tutorial to get a green light on wiz based bulb:
```JS
const wl = new WizLight('192.168.1.2'); // IP address of your light (check from router)

await wl.setLightStatus(true); // to turn the light ON, use false to turn it OFF.

const data = await wl.setLightProps({
       r: 0,        // red
       g: 255,      // green
       b: 0,        // blue
       dimming: 100 // strength
 });
```
Supports options configuration:
```js
const wl = new WizLight('192.168.1.2', { // IP address of your light (check from router)
   // Port number; 
   // Default is 38899
   port: 38899,
   
   // As all the communication happens over UDP, there is no direct response to the request.
   // We have to wait for some time to receive a message from the device to know if the request was served or not, post 
   // that time the request is considered as failed and retry mechanism kicks in.

   // This represents the time that we should wait before retrying.
   // Default is 1000ms
   statusCheckTimeout: 1000;

   // Number of times we should retry a request in case of a failure.
   // Default is 5
   retryTimes: 5;
}); 
```

This lib would not have been possible without the help that I received from this article: https://aleksandr.rogozin.us/blog/2021/8/13/hacking-philips-wiz-lights-via-command-line
