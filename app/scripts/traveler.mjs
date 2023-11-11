import { readFileSync } from "fs";
import { exec, execSync } from "child_process";
import arg from "arg";

async function main() {
  const opts = getOptions(process.argv);
  const data = JSON.parse(readFileSync(opts.data, "utf-8"));
  const locations = data.map((d) => `${d.lat},${d.lon}`);
  const simulator = execSync(
    "xcrun simctl list devices booted | grep Booted | awk '{print $4}'"
  )
    .toString()
    .replace("(", "")
    .replace(")", "")
    .trim();

  let args = [];

  if (opts.command === "start") {
    args = [
      "xcrun",
      "simctl",
      "location",
      simulator,
      "start",
      ...locations,
      "--speed",
      opts.speed,
    ];
  } else if (opts.command === "reset") {
    args = ["xcrun", "simctl", "location", simulator, "set", `${locations[0]}`];
  }

  exec(args.join(" "), (err, stdout) => {
    if (err) {
      console.error(err);
    } else {
      console.log(stdout);
    }
  });
}

function getOptions(rawArgs) {
  const command = rawArgs[2];

  if (!command) {
    throw new Error("Please specify a command");
  }

  const args = arg(
    {
      "--speed": String,
      "--data": String,
    },
    { argv: rawArgs.slice(3) }
  );

  return {
    command,
    speed: args["--speed"] || "20",
    data: args["--data"] || "./scripts/travel-data-center.json",
  };
}

main();
