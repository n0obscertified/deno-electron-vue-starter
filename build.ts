import {copy, ensureDir , existsSync}  from "@std/fs";

import {load} from "@std/dotenv";

import { join } from "@std/path";

// import { loadEnv } from "vite";

async function build() {
  const distDir = "./dist";
  if (existsSync(distDir)) {
    console.log("Removing dist directory");
    await Deno.remove(distDir, { recursive: true });
    console.log("Removed dist directory");
  }
  await ensureDir(distDir);

  // Copy necessary files
  const filesToCopy = [
    // ["node_modules", "node_modules"],
    ["deno.json", "deno.json"],
    ["electron_app", "electron_app"],
    [".env", ".env"]

  ];

  for (const [src, dest] of filesToCopy) {
    console.log(`Copying ${src} to ${dest}`);
    await copy(
      join(Deno.cwd(), src),
      join(distDir, dest),
      { overwrite: true }
    );
    console.log(`Copied ${src} to ${dest}`);
  }

  // Create a launcher script that sets the correct working directory
  const launcherScript = `#!/bin/bash
DIR="$( cd "$( dirname "\${BASH_SOURCE[0]}" )" && pwd )"
cd "\${DIR}"
./app
`;

  // Compile the main app

  const p = new Deno.Command("deno", {
    args: [
      "compile",
      "--allow-all",


      "--output",
      join(distDir, "app"),
      "--target", "x86_64-apple-darwin",

      "main.ts"
    ],
  });

  const { code } = await p.output();
  if (code !== 0) {
    throw new Error("Failed to compile");
  }

  // Write and make launcher executable
  await Deno.writeTextFile(join(distDir, "start.sh"), launcherScript);
  await Deno.chmod(join(distDir, "start.sh"), 0o755);
}

await build();
