const commander = require("commander");
const inquirer = require("inquirer");
const axios = require("axios");
const neatCsv = require("neat-csv");
const chalk = require("chalk");
const prettyjson = require("prettyjson");

module.exports = function supportedCurrency() {
  const question = [
    {
      name: "currency",
      type: "input",
      message: "Enter the three digit currency code you want to check:",
      validate: function (value) {
        //regex to check if entered value is a number
        if (/^\d+$/.test(value)) {
          return "Currency code must be text characters";
        } else if (value.length < 3 || value.length > 3) {
          return "Currency code must be 3 characters";
        } else {
          return true;
        }
      },
    },
  ];

  // CLI init
  commander
    .version("v1.0.0")
    .description(
      "This is an application to check supported currencies for use in Stocks."
    );

  // Example command
  commander
    .command("Example")
    .alias("e")
    .description("An example of currency code")
    .action(() => {
      console.log("An example of currency code is 'USD'");
    });

  // Check currency command
  commander
    .command("Check Currency")
    .alias("c")
    .description("Check if currency is supported")
    .action(async () => {
      const currencyCode = await inquirer.prompt(question);

      const url =
        "https://focusmobile-interview-materials.s3.eu-west-3.amazonaws.com/Cheap.Stocks.Internationalization.Currencies.csv";

      const csv = await axios.get(url);

      const currencies = await neatCsv(csv.data);

      const supportedCurr = currencies.find(
        (curr) => curr["ISO 4217 Code"] === currencyCode.currency.toUpperCase()
      );

      if (supportedCurr) {
        console.log(
          chalk.grey(
            `${currencyCode.currency.toUpperCase()} is supported and your stocks will be calculated using ${
              supportedCurr.Currency
            }`
          )
        );
      } else {
        console.log(
          `Sorry, ${currencyCode.currency.toUpperCase()} is not currently supported. Please enter another currency code.`
        );
      }
    });

  // List available currencies command
  commander
    .command("List Currencies")
    .alias("l")
    .description("A list of all supported currencies")
    .action(async () => {
      const url =
        "https://focusmobile-interview-materials.s3.eu-west-3.amazonaws.com/Cheap.Stocks.Internationalization.Currencies.csv";

      const csv = await axios.get(url);

      const currencies = await neatCsv(csv.data);

      console.log(prettyjson.render(currencies));
    });

  commander.parse(process.argv);
};
