const util = require("util");
const proxy = require("node-tcp-proxy");
const DynamicProcess = require("../lib/dynamic-process");
const mcProcess = new DynamicProcess({
  maxInactiveTimeMs: 1000 * 60 * 6,
  command: "java",
  cwd: "D:\\MCServer",
  args: ["-jar", "D:\\MCServer\\server.jar", "nogui"],
});

const mcProxy = proxy.createProxy(25565, "localhost", 25566, {
  upstream: function (ctx, data) {
    mcProcess.poke();
    return data;
  },
});
