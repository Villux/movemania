import { readFileSync } from "fs";
import { exec } from "child_process";

const simulator = "iPhone 15";

async function main() {
  const data = JSON.parse(readFileSync(`./scripts/travel-data.json`, "utf-8"));
  const location = data[0];

  const args = [
    "xcrun",
    "simctl",
    "location",
    `\"${simulator}\"`,
    "set",
    `${location.lat},${location.lon}`,
  ];

  console.log("Resetting location with", args.join(" "));

  exec(args.join(" "), (err, stdout, stderr) => {
    if (err) {
      console.error(err);
      return;
    }
    console.log(stdout);
  });
}

main();
