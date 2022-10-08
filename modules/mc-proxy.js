const util = require("util");
const proxy = require("node-tcp-proxy");
const mcProxy = proxy.createProxy(25565, "localhost", 25566, {
  upstream: function (ctx, data) {
    console.log(
      util.format(
        "Client %s:%s sent:",
        ctx.proxySocket.remoteAddress,
        ctx.proxySocket.remotePort
      )
    );
    console.log(data.toString("utf-8"));

    return data;
  },
});
