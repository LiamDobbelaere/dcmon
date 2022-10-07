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

app.get("/", async (req, res) => {
  const response = (
    await getOutput(
      'neofetch --stdout --cpu_temp C --disk_show / --disk_percent on --disk_subtitle name --separator "%sep%"'
    )
  )
    .split("\n")
    .slice(2)
    .map((entry) => {
      const [key, value] = entry.split("%sep%");
      return !key
        ? ""
        : `<div class='entry'><span>${key}</span><span>${
            value || ""
          }</span></div>`;
    })
    .join("")
    .trim();

  res.send(`
    <html>
    <head>
    <style>
      html, body {
        display: flex;
        flex-direction: column;
        background-color: #212126;
        color: #eee;
        font-family: sans-serif;
      }
      body {
        margin-left: auto;
        margin-right: auto;
        gap: 8px;
      }
      .entry {
        display: flex;
        flex-direction: row;
        gap: 8px;
      }
      .entry > span:nth-child(1) {
        background-color: #222bc7;
        padding: 4px;
        width: 128px;
      }
    </style>
    </head>
    <body>
    ${response}
    </body>
    </html>
  `);
});

app.listen(80, () => {
  console.log("Running!");
});