import inquirer from "inquirer";
import fs from "fs";
import path, { dirname } from "path";
import { fileURLToPath } from "url";
import chalk from "chalk";

const __dirname = dirname(fileURLToPath(import.meta.url));

const templates = {
  React: path.join(__dirname, "templates", "react"),
  Vue: path.join(__dirname, "templates", "vue"),
  Javascript: path.join(__dirname, "templates", "javascript")
};

function copy(target, source) {
  try {
    if (fs.lstatSync(source).isDirectory()) {
      fs.mkdirSync(target, { recursive: true });
      fs.readdirSync(source).forEach((file) => {
        copy(path.join(target, file), path.join(source, file));
      });
    } else {
      fs.copyFileSync(source, target);
    }
  } catch (error) {
    console.error(chalk.red(`Error copying files: ${error.message}`));
    console.error(chalk.yellow("For more information, visit our docs: https://github.com/akii09/FlexEx#flexex-"));
    process.exit(1);
  }
}

const QUESTIONS = [
  {
    type: "input",
    name: "name",
    message: "What is your project name?",
    default: "flex-ex"
  },
  {
    type: "list",
    name: "template",
    message: "Which template would you like to use?",
    choices: ["React", "Vue", "Javascript"]
  }
];

async function promptUser() {
  try {
    const answers = await inquirer.prompt(QUESTIONS);
    const projectName = answers.name.trim();
    const targetPath = path.join(process.cwd(), projectName);

    if (fs.existsSync(targetPath)) {
      const { useAnotherName } = await inquirer.prompt({
        type: "confirm",
        name: "useAnotherName",
        message: "Would you like to use another name?",
        default: true
      });

      if (useAnotherName) {
        return promptUser();
      }
      
      console.log(chalk.green("Exiting..."));
      process.exit(0);
    }

    fs.mkdirSync(targetPath, { recursive: true });
    copy(targetPath, templates[answers.template]);

    console.log(chalk.green("\n\n🚀 Project setup successful! Get ready to launch your extension! 🚀"));
    console.log(chalk.whiteBright("\nReady to start crafting your masterpiece? Here's how:\n"));
    console.log(chalk.cyan(`    📁 cd ${projectName}`));
    console.log(chalk.cyan("    💻 npm install"));
    console.log(chalk.cyan("    🚀 npm run dev\n"));
    console.log(chalk.whiteBright("For more tips and tricks, visit our docs: https://github.com/akii09/FlexEx#flexex-\n"));
  } catch (error) {
    console.error(chalk.red(`Error: ${error.message}`));
    process.exit(1);
  }
}

export function createProject() {
  return promptUser();
}
