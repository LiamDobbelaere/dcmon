const util = require("util");
const proxy = require("node-tcp-proxy");
const DynamicProcess = require("../lib/dynamic-process");
const mcProcess = new DynamicProcess({
  command: "java",
  cwd: "D:\\MCServer",
  args: ["-jar", "D:\\MCServer\\server.jar", "nogui"],
});

const mcProxy = proxy.createProxy(25565, "localhost", 25566, {
  upstream: function (ctx, data) {
    /*console.log(
      util.format(
        "Client %s:%s sent:",
        ctx.proxySocket.remoteAddress,
        ctx.proxySocket.remotePort
      )
    );
    console.log(data.toString("utf-8"));*/
    mcProcess.poke();

    return data;
  },
});

console.log("MCProxy running!");
