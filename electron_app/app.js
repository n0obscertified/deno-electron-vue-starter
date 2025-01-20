import { app, BrowserWindow, protocol, net , desktopCapturer, session}  from 'electron/main'
import path from 'node:path'
import process from 'node:process'
import { fileURLToPath } from 'node:url';

// Define __dirname for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


console.log(process.argv)
function createWindow () {

  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true,        // Enable Node.js integration
      contextIsolation: true,       // Keep context isolation for security
      sandbox: false,               // Disable sandbox to allow Node modules
      preload:   path.join(__dirname, './preload.cjs')
    }
  })

  win.webContents.openDevTools()
  win.loadURL(process.argv[2])
}


app.whenReady().then(() => {
  createWindow()
  session.defaultSession.setDisplayMediaRequestHandler((request, callback) => {
    desktopCapturer.getSources({ types: ['screen', 'window'] }).then((sources) => {
      // Grant access to the first screen found.
      callback({ video: sources[0], audio: 'loopback' })
    })
    // If true, use the system picker if available.
    // Note: this is currently experimental. If the system picker
    // is available, it will be used and the media request handler
    // will not be invoked.
  }, { useSystemPicker: true })

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow()
    }
  })
})

app.on('window-all-closed', () => {
  // if (process.platform !== 'darwin') {
    app.quit()
  // }
})

// process.send('Hello from the main process')

app.on('ready', () => {
  // Protocol handler for file:// URLs
  protocol.handle('file', (request) => {
    return net.fetch(request);
  });
});
