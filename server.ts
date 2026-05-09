import { createServer } from "https";

import next from "next";

import fs from "fs";

const dev =
  process.env.NODE_ENV !== "production";

const app = next({ dev });

const handle = app.getRequestHandler();

const httpsOptions = {
  key: fs.readFileSync("./certs/key.pem"),

  cert: fs.readFileSync("./certs/cert.pem"),
};

app.prepare().then(() => {
  createServer(
    httpsOptions,

    (req, res) => {
      handle(req, res);
    }
  ).listen(3443, () => {
    console.log(
      "✅ HTTPS running: https://localhost:3000"
    );
  });
});