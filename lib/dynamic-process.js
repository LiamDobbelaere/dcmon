const { spawn } = require("node:child_process");
const fs = require("fs");
const treeKill = require("tree-kill");

function DynamicProcess(options = {}) {
  const defaultOptions = {
    maxInactiveTimeMs: 1000 * 10,
    command: "",
    args: "",
    cwd: "",
  };
  options = Object.assign({}, defaultOptions, options);

  // private stuff
  let lastSpawnTime = 0;
  let killProcessTimeout = null;
  let childProcess = null;
  const out = fs.openSync(`./dp-${options.command}-out.log`, "a"),
    err = fs.openSync(`./dp-${options.command}-error.log`, "a");
  const killProcess = () => {
    if (childProcess) {
      treeKill(childProcess.pid);
      console.log(
        `[DynamicProcess] Killed ${options.command} (${childProcess.pid})`
      );
    } else {
      console.log(
        `[DynamicProcess] Attempted to kill ${options.command}, but it was already gone. This may be a problem.`
      );
    }
  };
  // public stuff
  this.poke = () => {
    if (!childProcess && new Date() - lastSpawnTime > 2000) {
      lastSpawnTime = new Date();
      childProcess = spawn(options.command, options.args, {
        cwd: options.cwd,
        //stdio: ["ignore", out, err],
        stdio: ["ignore", process.stdout, process.stderr],
      });
      process.on("exit", () => childProcess.kill());
      console.log(
        `[DynamicProcess] Spawned ${options.command} (${childProcess.pid})`
      );
      childProcess.on("exit", (code) => {
        console.log(
          `[DynamicProcess] ${options.command} (${childProcess.pid}) exited with code ${code}!`
        );
        childProcess = null;
      });
    }

    if (childProcess) {
      clearTimeout(killProcessTimeout);
      killProcessTimeout = setTimeout(() => {
        killProcess();
      }, options.maxInactiveTimeMs);
    }
  };
}

module.exports = DynamicProcess;
