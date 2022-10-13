const express = require("express");
const app = express();
const useModules = [["server-info", "/serverinfo"], ["mc-proxy"]];

app.use(express.static(__dirname + "/public"));

useModules.forEach(([moduleName, mountPoint]) => {
  const module = require(`./modules/${moduleName}.js`);
  if (mountPoint) {
    app.use(mountPoint, module);
    console.log(`[Init] ${moduleName} mounted at ${mountPoint}`);
  } else {
    console.log(`[Init] ${moduleName} loaded (no mount specified)`);
  }
});

app.listen(80, () => {
  console.log("[Init] HTTP ready!");
});
