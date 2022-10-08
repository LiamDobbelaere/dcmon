const express = require("express");
const app = express();
const useModules = [["server-info", "/serverinfo"], ["mc-proxy"]];

useModules.forEach(([moduleName, mountPoint]) => {
  const module = require(`./modules/${moduleName}.js`);
  if (mountPoint) {
    app.use(mountPoint, module);
  }
});

app.listen(80, () => {
  console.log("Running!");
});
