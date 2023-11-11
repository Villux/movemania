import { readFileSync } from "fs";
import { exec } from "child_process";

/**
 * Get data points from https://www.gpxgenerator.com/
 * and ask ChatGPT to extract the lat/lon pairs as JSON.
 */

const simulator = "iPhone 15";

async function main() {
  const data = JSON.parse(readFileSync(`./scripts/travel-data-center.json`, "utf-8"));
  const locations = data.map((d) => `${d.lat},${d.lon}`);

  const args = [
    "xcrun",
    "simctl",
    "location",
    `\"${simulator}\"`,
    "start",
    ...locations,
    "--speed",
    "20",
  ];

  console.log("Simulating travel with", args.join(" "));

  exec(args.join(" "), (err, stdout, stderr) => {
    if (err) {
      console.error(err);
      return;
    }
    console.log(stdout);
  });
}

main();
