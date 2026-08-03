#!/usr/bin/env node
/**
 * Launches the Astro dev server, always on DEV_PORT.
 *
 * The dev server must never silently drift to another port, so this refuses to
 * start when the port is taken: it prints the process holding it and exits.
 * Pass --force (or `pnpm dev:force`) to kill that process first.
 */

import { spawn, execFileSync } from "node:child_process";

const DEV_PORT = 4000;
const force = process.argv.includes("--force");
const astroArgs = process.argv.slice(2).filter((arg) => arg !== "--force");

function listenerPids() {
  let out;
  try {
    out = execFileSync("ss", ["-ltnpH"], { encoding: "utf8", stdio: ["ignore", "pipe", "ignore"] });
  } catch {
    return [];
  }

  const pids = new Set();
  for (const line of out.split("\n")) {
    // Columns: State Recv-Q Send-Q Local:Port Peer:Port users:(("name",pid=N,fd=N))
    const localAddr = line.trim().split(/\s+/)[3];
    if (!localAddr || !localAddr.endsWith(`:${DEV_PORT}`)) continue;
    for (const match of line.matchAll(/pid=(\d+)/g)) {
      pids.add(match[1]);
    }
  }
  return [...pids];
}

function describe(pid) {
  try {
    return execFileSync("ps", ["-p", pid, "-o", "args="], { encoding: "utf8" }).trim();
  } catch {
    return "(process details unavailable)";
  }
}

function waitForExit(pids, deadlineMs = 5000) {
  const start = Date.now();
  while (Date.now() - start < deadlineMs) {
    if (pids.every((pid) => !isAlive(pid))) return true;
    execFileSync("sleep", ["0.2"]);
  }
  return pids.every((pid) => !isAlive(pid));
}

function isAlive(pid) {
  try {
    process.kill(Number(pid), 0);
    return true;
  } catch {
    return false;
  }
}

let existing = listenerPids();

if (existing.length > 0) {
  if (!force) {
    console.error(`\nPort ${DEV_PORT} is already in use — not starting a second dev server.\n`);
    for (const pid of existing) {
      console.error(`  pid ${pid}: ${describe(pid)}`);
    }
    console.error(
      `\nReuse it at http://localhost:${DEV_PORT}/, or run \`pnpm dev:force\` to ` +
        `kill it and start fresh.\n`
    );
    process.exit(1);
  }

  console.log(`Port ${DEV_PORT} in use — stopping existing process(es): ${existing.join(", ")}`);
  for (const pid of existing) {
    try {
      process.kill(Number(pid), "SIGTERM");
    } catch {
      // Already gone.
    }
  }
  if (!waitForExit(existing)) {
    for (const pid of existing.filter(isAlive)) {
      try {
        process.kill(Number(pid), "SIGKILL");
      } catch {
        // Already gone.
      }
    }
    waitForExit(existing, 2000);
  }
  if (listenerPids().length > 0) {
    console.error(`Could not free port ${DEV_PORT}. Stop the process manually and retry.`);
    process.exit(1);
  }
}

const child = spawn(
  "astro",
  ["dev", "--port", String(DEV_PORT), ...astroArgs],
  { stdio: "inherit", shell: false }
);

child.on("exit", (code, signal) => {
  process.exit(signal ? 1 : (code ?? 0));
});
