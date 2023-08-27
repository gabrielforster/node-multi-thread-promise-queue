import { parentPort } from "node:worker_threads";
import { spawn } from "node:child_process";

function emitError() {
    parentPort?.postMessage("error");
}

function emitDone() {
    parentPort?.postMessage("done");
}

parentPort?.on("message", async (message) => {
  if (message === "run") {
    const process = spawn("node", ["process/index.js"]);
    const stderr = [];

    process.stdout.on("data", (_) => { });
    process.stderr?.on("data", (data) => { stderr.push(data); });
    process.on("error", emitError);
    process.on("close", () => {
      if(stderr.length) emitError();

      emitDone();
    });
  }
});
