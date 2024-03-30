#!/usr/bin/env node

import inquirer from 'inquirer';
import fs from 'fs';
import path, { dirname as pathDirname } from 'path';
import { fileURLToPath } from 'url';
import chalk from 'chalk';


const __dirname = pathDirname(fileURLToPath(import.meta.url));
// Paths to templates
const templates = {
    "React": path.join(__dirname, '..', 'templates', 'react'),
    "Vue": path.join(__dirname, '..', 'templates', 'vue'),
    "Javascript": path.join(__dirname, '..', 'templates', 'javascript'),
};

// Function to perform the copy
function copy(dest, src) {
    try {
        if (fs.lstatSync(src).isDirectory()) {
            fs.mkdirSync(dest, { recursive: true });  // creates directory recursively
            fs.readdirSync(src).forEach((child_item_name) => {
                copy(path.join(dest, child_item_name), path.join(src, child_item_name));
            });
        } else {
            fs.copyFileSync(src, dest);
        }
    } catch (err) {
        console.error(chalk.red(`Error copying files: ${err.message}`));
        console.error(chalk.yellow('For more information, visit our docs: https://www.your-docs-url.com'));
        process.exit(1);
    }
}

// Default project name if not provided by the user
const DEFAULT_PROJECT_NAME = 'flex-ex';

// Questions to ask the user
const QUESTIONS = [
    {
        type: 'input',
        name: 'name',
        message: 'What is your project name?',
        default: DEFAULT_PROJECT_NAME,
    },
    {
        type: 'list',
        name: 'template',
        message: 'Which template would you like to use?',
        choices: ['React', 'Vue', 'Javascript'],
    },
];

// Ask questions
function promptUser() {
    inquirer.prompt(QUESTIONS).then((answers) => {
        const projectName = answers.name.trim();
        const projectDirectory = path.join(process.cwd(), projectName);
        if (fs.existsSync(projectDirectory)) {
            console.error(chalk.red(`A directory with the name '${projectName}' already exists.`));
            inquirer.prompt({
                type: 'confirm',
                name: 'useAnotherName',
                message: 'Would you like to use another name?',
                default: true,
            }).then((answer) => {
                if (answer.useAnotherName) {
                    promptUser();
                } else {
                    console.log(chalk.green('Exiting...'));
                    process.exit(0);
                }
            });
        } else {
            // Create new directory
            fs.mkdirSync(projectDirectory, { recursive: true });

            // Copy selected template to new directory
            copy(projectDirectory, templates[answers.template]);

            console.log(chalk.green('\n\n🚀 Project setup successful! Get ready to launch your extension! 🚀'));
            console.log(chalk.whiteBright('\nReady to start crafting your masterpiece? Here\'s how:\n'));
            console.log(chalk.cyan(`    📁 cd ${projectName}`));
            console.log(chalk.cyan('    💻 npm install'));
            console.log(chalk.cyan('    🚀 npm start\n'));
            console.log(chalk.whiteBright('For more tips and tricks, visit our docs: https://www.your-docs-url.com\n'));
        }
    });
}

promptUser();
