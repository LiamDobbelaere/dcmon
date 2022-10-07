const express = require("express");
const app = express();
const exec = require("child_process").exec;

const getOutput = (command) => {
  return new Promise((resolve, reject) => {
    exec(command, (err, stdout, _) => {
      if (err) reject(err);
      resolve(stdout);
    });
  });
};

app.get("/neofetch", async (req, res) => {
  const response = await getOutput("neofetch");
  res.send(response);
});

app.get("/", async (req, res) => {
  res.send(`
    <!doctype html>
    <html>
      <head>
        <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/xterm@5.0.0/css/xterm.css" />
        <script src="https://cdn.jsdelivr.net/npm/xterm@5.0.0/lib/xterm.min.js"></script>
      </head>
      <body>
        <div id="terminal"></div>
        <script>
          fetch('/neofetch').then(v => v.text()).then(v => {
            var term = new Terminal();
            term.open(document.getElementById('terminal'));
            term.write(v);
          });
        </script>
      </body>
    </html>
  `);
});

app.listen(80, () => {
  console.log("Running!");
});
