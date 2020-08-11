#!/usr/bin/env node
const chalk = require("chalk");
const clear = require("clear");
const figlet = require("figlet");
const supportedCurrency = require("./commands");

clear();

console.log(
  chalk.yellow(
    figlet.textSync("Cheap Stocks Inc", { horizontalLayout: "default" })
  )
);

const main = () => {
  supportedCurrency();
};

main();
