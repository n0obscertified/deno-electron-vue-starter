const { contextBridge, ipcRenderer,desktopCapturer }  = require("electron");
const { readFileSync } = require("node:fs");
const { join } =  require("node:path");
// import { fileURLToPath } from "node:url";

// Expose protected methods that allow the renderer process to use
// the ipcRenderer without exposing the entire object
contextBridge.exposeInMainWorld('api', {
    // Add any methods you want to expose to the renderer process
    send: (channel, data) => {
        ipcRenderer.send(channel, data)
    },
    receive: (channel, func) => {
        ipcRenderer.on(channel, (event, ...args) => func(...args))
    }
})


contextBridge.exposeInMainWorld("myCustomGetDisplayMedia", async () => {
    const sources = await desktopCapturer.getSources({
      types: ["window", "screen"],
    });
  
    // you should create some kind of UI to prompt the user
    // to select the correct source like Google Chrome does
    const selectedSource = sources[0]; // this is just for testing purposes
  
    return selectedSource;
  });



// inject renderer.js into the web page
// window.addEventListener("load", () => {
//   const rendererScript = document.createElement("script");
//   rendererScript.text = readFileSync(join(__dirname, "./renderer.cjs"))
//   document.body.appendChild(rendererScript);
// });