import { createServer } from "node:http";
import { Worker } from "node:worker_threads";

const server = createServer((req, res) => {
  if (req.url === "/hello") {
    console.log("Hello request")
    res.write("Hello World");
    return res.end();
  }

  if (req.url === "/promise") {
    console.log("Promise request")
    const worker = new Worker("./worker/index.js");

    worker.postMessage("run");
    worker.on("message", (message) => {
      if (message === "done") {
        res.write("Promise done");
        return res.end();
      }

      res.write("Promise error");
      return res.end();
    });
  }
});

server.listen(42690, () => {
  console.log("running server!");
})
