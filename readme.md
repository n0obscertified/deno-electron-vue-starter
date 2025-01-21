```markdown
# Electron-Deno-Vue Application

A desktop application framework combining Electron, Vue.js, and Deno for modern, secure desktop applications.

## Overview

This framework integrates:
- 🖥️ **Electron** - Desktop application wrapper
- ⚡ **Vue.js** - Frontend UI framework
- 🦕 **Deno** - Development environment and build tools

## Quick Start

1. Create `.env` file:
   ```
   DENO_ENV=development
   ```

2. Run the project:
   ```bash
   deno run -A main.ts
   ```

## Architecture
```
your-project/
├── electron_app/
│   ├── app.js
│   └── preload.cjs
├── main.ts
└── .env
```

### Communication Flow
Vue → Electron → Deno

Send messages from Vue to Deno:
```javascript
window.api.send('deno', {
  message: "Hello Deno!",
  someData: 123
})
```

Messages flow:
1. ✉️ Vue component sends message
2. 📨 Electron receives and processes
3. 📝 Transmitted via stdout
4. 📥 Captured by Deno process

## Development

### Debug Tools
- Deno console logging
- Electron DevTools (auto-opened)
- JSON message tracing

### Environment Modes

#### Development Mode
- Auto-creates Vue project
- Dev server on port 3000
- Hot-reloading enabled
- Set via `DENO_ENV=development`

#### Production Mode
- Builds Vue application
- Serves on port 2025
- Optimized performance

## Core Features

### 🔒 Security
- Context isolation
- Configurable sandbox
- Secure IPC communication
- Preload script protection

### 🎥 Screen Capture
- Window capture support
- Screen recording capable
- System picker integration

### 🔄 Process Management
- Automated setup
- Development workflow
- Build process integration
- Resource cleanup

## Component Structure

### Main Process (Deno)
- Environment configuration
- Process management
- Development server
- Build pipeline

### Electron Process
- Window management
- Native OS integration
- Protocol handling
- IPC communication

## Use Cases

### Ideal For
- 🖥️ Cross-platform desktop apps
- 📹 Screen recording tools
- 🔒 Secure desktop applications
- 🌐 Web-desktop hybrid apps

### Target Applications
- Enterprise desktop tools
- Media capture software
- Cross-platform utilities
- Modern development tools

## Debugging Guide

Watch for messages:
- Check Deno terminal
- Monitor Electron DevTools
- Trace communication flow

## Contributing

[Add contribution guidelines here]

## License

[Add license information here]
```
