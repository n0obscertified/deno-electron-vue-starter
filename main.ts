import { load } from "jsr:@std/dotenv@0.225.3";
import { dirname, fromFileUrl, join, relative } from "jsr:@std/path@1";

console.log(Deno.args);
// Get runtime directory and set it as working directory
const runtimeDir = Deno.mainModule.startsWith("file:")
  ? dirname(fromFileUrl(Deno.mainModule))
  : dirname(Deno.execPath());

// Change working directory to where the executable
console.log(`Working directory set to: ${Deno.cwd()}`);

// Get the bundled electron path from Deno's cache
console.log(`This is the deno dir: ${runtimeDir}`);
const installProcess = new Deno.Command("deno", {
  args: ["install", "--allow-scripts"],
  stderr: "inherit",
  stdout: "inherit",
});
const { code: _installcode } = await installProcess.output();
if (_installcode !== 0) {
  throw new Error("Failed to install dependencies");
}

const electronPath = join(
  Deno.cwd(),
  "node_modules",
  "electron",
  "dist",
  "Electron.app",
  "Contents",
  "MacOS",
  "Electron",
);

const records = await load();

const isDev = records["DENO_ENV"] === "development";
const port = isDev ? 3000 : 2025;
let _serveProcess: Deno.ChildProcess | undefined = undefined;
console.log(records);
if (isDev) {
  const createVueCommand = new Deno.Command("deno", {
    args: ["run", "-A", "jsr:@denovue/create-vue"],
    stdin: "inherit",
    stderr: "inherit",
    stdout: "inherit",
  });

  const createVueProcess = createVueCommand.spawn();
  const watcher = Deno.watchFs(".");
  let newDir = "";
  try {
    for await (const event of watcher) {
      if (event.kind === "create" && event.paths[0].includes("deno.json")) {
        newDir = event.paths[0].split("/").slice(0, -1).join("/");
        console.log(`Vue project created in ${newDir}`);
        watcher.close();
        break;
      }
    }
  } catch (e) {
    console.error(e);
  }

  const status = await createVueProcess.status;
  if (!status.success) {
    throw new Error("Failed to install dependencies");
  }

  // Deno.chdir(join(Deno.cwd(), "vue"));
  Deno.chdir(newDir);

  const installVueDirDependencies = new Deno.Command("deno", {
    args: ["install", "--allow-scripts"],
    stdin: "inherit",
    stderr: "inherit",
    stdout: "inherit",
  });

  const installVueDirProcess = installVueDirDependencies.spawn();
  const installVueDirStatus = await installVueDirProcess.status;
  if (!installVueDirStatus.success) {
    throw new Error("Failed to install dependencies");
  }

  // Development: Use Vite's dev server
  //    server = await createServer({
  //     configFile: './vite.config.ts',

  //   })

  const devProcess = new Deno.Command("deno", {
    args: ["task", "dev"],
    stderr: "piped",
    stdout: "piped",
  });
  _serveProcess = devProcess.spawn();
  Deno.chdir(join(Deno.cwd(), "../"));
  //   await server.listen()
  //   console.log('Vite dev server running at:', server.resolvedUrls)
} else {
  // Production: Use Vite's preview server
  const buildProcess = new Deno.Command("deno", {
    args: ["task", "build"],
    stderr: "inherit",
    stdout: "inherit",
  });
  await buildProcess.output();
  const previewProcess = new Deno.Command("deno", {
    args: ["task", "preview"],
    stderr: "piped",
    stdout: "piped",
  });
  _serveProcess = previewProcess.spawn();

  console.log("Vite preview server running at:", "http://localhost:2025");
}

// Function to convert file path to URL format
function fileToUrl(filePath: string): string {
  const relativePath = relative(runtimeDir, filePath);
  return `file://${join(runtimeDir, relativePath)}`;
}

// When handling file clicks:
const appPath = join(Deno.cwd(), "electron_app", "app.js");
const reader = _serveProcess.stdout.getReader();
const vite_stdout_reader = (async () => {
  try {
    while (true) {
      const { done, value } = await reader.read();
      const text = new TextDecoder("Utf8").decode(value);
      if (text.includes("Local:   http://localhost:3000/")) {
        startElectron();
        // reader.releaseLock();
        break
      }
      if (done) break;
    }
  } catch (e) {
    console.error(e);
  }
})();

// For the electron process, pass the file URL
let electronCommand;
async function startElectron() {
  electronCommand = new Deno.Command(electronPath, {
    args: [
      appPath,
      `http://localhost:${port}`,
      fileToUrl("."), // Pass the base path for file access
    ],
    stdout: "piped",
    stderr: "piped",
  });

  try {
    const electronProcess = electronCommand.spawn();
    const { signal, success } = await electronProcess.status;
    if (success) {
      console.debug("Ran Electron to completion");
    }
  } catch (e) {
    console.debug(e);
  } finally {
    // console.debug(_serveProcess);
    _serveProcess?.kill("SIGKILL");
  }
}
// const child: ChildProcess  = Deno.run(electronPath, [appPath,Deno.args[0],Deno.args[1]], {
//     stdio: ['inherit', 'inherit', 'inherit', 'ipc']
//   })

// child.on('message', (message: any) => {
//   console.log(message)
// })

// child.on('error', (error: Error) => {
//   console.error(error)
// })
