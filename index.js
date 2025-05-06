import inquirer from "inquirer";
import { execSync } from "child_process";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import chalk from "chalk";
import { options } from "./constants/options.js";
import {
  createManifest,
  createBackgroundJs,
  copyIconsFolder,
} from "./scripts/core-files.js";
const __dirname = path.dirname(fileURLToPath(import.meta.url));

export async function createProject() {
  // Prompt for project details
  const { projectName, template } = await inquirer.prompt(options);
  // Scaffold Vite project
  console.log(
    chalk.blue(`\nCreating Vite project with template "${template}"...`),
  );
  execSync(`npm create vite@latest ${projectName} -- --template ${template}`, {
    stdio: "inherit",
  });
  const projectPath = path.join(process.cwd(), projectName);
  const publicDir = path.join(projectPath, "public");
  // Ensure public directory exists
  fs.mkdirSync(publicDir, { recursive: true });
  // Generate manifest.json
  createManifest(projectName, projectPath);
  // Create background.js
  createBackgroundJs(projectName, projectPath);
  // Copy icons folder to public directory
  const iconsSourcePath = path.join(__dirname, "icons");
  copyIconsFolder(iconsSourcePath, projectPath);
  console.log(chalk.green("\n✅ Chrome Extension project setup complete!"));
  console.log(chalk.cyan(`\nNext steps:`));
  console.log(chalk.cyan(`  cd ${projectName}`));
  console.log(chalk.cyan("  npm install"));
  console.log(chalk.cyan("  npm run dev\n"));
}
