import fs from 'fs';
import { Command } from 'commander';
import chalk from 'chalk';

const program = new Command();

program
  .name("Budgettracker")
  .description("A tracker to help you manage your money")
  .version("1.0.0");

// Add item

program
  .command("new")
  .description("Adds a new item")
  .option("-t, --title <value>", "title of the new budget to be added")
  .option("-q, --quantity <value>", "quantity of the new budget")
  .option("-p, --price <value>", "price per quantity of the new budget")
  .action((options) => {
    const title = options.title;
    const quantity = options.quantity;
    const price = options.price;

    // Check if required options are provided
    if (!title || !quantity || !price) {
      console.log(chalk.bgRed("All fields (title, quantity, price) are required!"));
      return;
    }

    const newBudget = {
      title: title,
      quantity: quantity,
      price: price,
      createdAt: new Date(),
      lastUpdatedAt: new Date(),
    };

    let budgets = [];

    // Try to read and parse the existing budgets
    try {
      const loadedBudgets = fs.readFileSync("./data/budgets.json", "utf-8");
      budgets = JSON.parse(loadedBudgets);
    } catch (err) {
      // If file doesn't exist or is empty, we assume it's a new start
      console.log(chalk.yellow("No existing budgets found, starting fresh..."));
    }

    // Check if a budget with the same title already exists
    const budgetExists = budgets.find((currentBudget) => currentBudget.title === title);
    if (budgetExists) {
      console.log(chalk.bgRed(`Budget with title '${title}' already exists`));
      return;
    }

    // Add the new budget
    budgets.push(newBudget);

    // Write updated budgets back to the file
    fs.writeFileSync("./data/budgets.json", JSON.stringify(budgets, null, 2));
    console.log(chalk.bgGreen("New budget added successfully!"));
  });

  //update item
  program
  .command("update")
  .description("Update an existing budget item")
  .option("-t, --title <value>", "Title of the budget to update")
  .option("-q, --quantity <value>", "New quantity of the budget")
  .option("-p, --price <value>", "New price per quantity")
  .action((options) => {
    const { title, quantity, price } = options;

    // Check if the title is provided
    if (!title) {
      console.log(chalk.bgRed("Please provide a title using the --title or -t option"));
      return;
    }

    // Read and parse the budgets file
    let budgets = [];
    try {
      const loadedBudgets = fs.readFileSync("./data/budgets.json", "utf-8");
      budgets = JSON.parse(loadedBudgets);
    } catch (err) {
      console.log(chalk.bgRed("No budgets found or the file is not accessible"));
      return;
    }

    // Find the budget item by title
    const budgetIndex = budgets.findIndex((budget) => budget.title === title);

    if (budgetIndex === -1) {
      console.log(chalk.bgRed(`No budget found with the title '${title}'`));
      return;
    }

    // Update fields if provided
    if (quantity) {
      budgets[budgetIndex].quantity = quantity;
    }

    if (price) {
      budgets[budgetIndex].price = price;
    }

    // Update last updated timestamp
    budgets[budgetIndex].lastUpdatedAt = new Date();

    // Save the updated budgets to the file
    fs.writeFileSync("./data/budgets.json", JSON.stringify(budgets, null, 2));
    console.log(chalk.bgGreen(`Budget with title '${title}' updated successfully!`));
  });
  //get item
  program
  .command("get")
  .description("Get a specific budget item by title")
  .option("-t, --title <value>", "Title of the budget to retrieve")
  .action((options) => {
    const title = options.title;

    // Check if the title is provided
    if (!title) {
      console.log(chalk.bgRed("Please provide a title using the --title or -t option"));
      return;
    }

    // Read and parse the budgets file
    let budgets = [];
    try {
      const loadedBudgets = fs.readFileSync("./data/budgets.json", "utf-8");
      budgets = JSON.parse(loadedBudgets);
    } catch (err) {
      console.log(chalk.bgRed("No budgets found or the file is not accessible"));
      return;
    }

    // Check if there are no budgets
    if (budgets.length === 0) {
      console.log(chalk.bgYellow("You don't have any items yet"));
      return;
    }

    // Find the budget with the given title
    const budgetItem = budgets.find((budget) => budget.title === title);

    if (budgetItem) {
      // If found, display the budget
      console.log(chalk.bgGreen("Budget found:"));
      console.log(budgetItem);
    } else {
      // If not found, inform the user
      console.log(chalk.bgRed(`No budget found with the title '${title}'`));
    }
  });






  //delete item
  program.command("delete")
  .description("Deletes a specified budget item")
  .option("-t, --title <value>", "Title of the item to be deleted")
  .action(function (options) {
    const title = options.title;

    // Load and parse the budgets from the file
    const loadedBudgets = fs.readFileSync("./data/budgets.json", "utf8");
    const budgets = JSON.parse(loadedBudgets);

    // Check if the budgets array is empty
    if (budgets.length === 0) {
      console.log(chalk.bgYellow("Nothing to delete"));
      return;
    }

    // Filter out the budget with the matching title
    const remainingBudgets = budgets.filter((currentBudget) => currentBudget.title !== title);

    // If no changes (i.e., no budget with the given title was found)
    if (remainingBudgets.length === budgets.length) {
      console.log(chalk.bgRed(`No budget found with the title '${title}'`));
      return;
    }

    // Write the updated budgets back to the file
    fs.writeFileSync("./data/budgets.json", JSON.stringify(remainingBudgets, null, 2));

    console.log(chalk.bgGreen(`Budget with title '${title}' deleted successfully`));
  });









// Parse command-line arguments
program.parse(process.argv); 
