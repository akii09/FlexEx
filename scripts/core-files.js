import fs from 'fs';
import path from 'path';

/**
 * Creates a manifest.json file in the public directory
 * @param {string} projectName 
 * @param {string} projectPath 
 * @returns {string} Path to the created manifest.json
 */
export const createManifest = (projectName, projectPath) => {
  const manifest = {
    manifest_version: 3,
    name: projectName,
    version: "1.0.0",
    description: "A Chrome extension built with Vite and FlexEx",
    action: {
      default_popup: "index.html",
    },
    background: {
      service_worker: "background.js"
    },
    permissions: [],
    icons: {
      "16": "icons/icon-16.png",
      "48": "icons/icon-48.png",
      "128": "icons/icon-128.png"
    }
  };

  const publicDir = path.join(projectPath, 'public');
  if (!fs.existsSync(publicDir)) fs.mkdirSync(publicDir, { recursive: true });

  const manifestPath = path.join(publicDir, 'manifest.json');
  fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2), 'utf-8');

  return manifestPath; // ✅ Return it
};

/**
 * Creates a background.js file in the src directory
 * @param {string} projectPath 
 */
export const createBackgroundJs = (projectPath) => {
  const srcDir = path.join(projectPath, 'public');
  if (!fs.existsSync(srcDir)) fs.mkdirSync(srcDir, { recursive: true });

  const bgPath = path.join(srcDir, 'background.js');
  const content = `// background script
chrome.runtime.onInstalled.addListener(() => {
  console.log('Extension installed!');
});`;

  fs.writeFileSync(bgPath, content, 'utf-8');
};

/**
 * Recursively copies the "icons" folder to the project's public directory
 * @param {string} sourceDir - Path to the local icons folder
 * @param {string} projectPath - Path to the new project root
 */
export const copyIconsFolder = (sourceDir, projectPath) => {
  try {
    const destDir = path.join(projectPath, 'public', 'icons');

    // Ensure the destination directory exists
    fs.mkdirSync(destDir, { recursive: true });

    // Read all files/folders from the source
    const items = fs.readdirSync(sourceDir);

    for (const item of items) {
      const srcItem = path.join(sourceDir, item);
      const destItem = path.join(destDir, item);

      const stat = fs.statSync(srcItem);

      if (stat.isDirectory()) {
        // Recursively copy subdirectories
        copyIconsFolder(srcItem, path.join(projectPath, 'public', 'icons'));
      } else {
        // Copy file
        fs.copyFileSync(srcItem, destItem);
      }
    }

    console.log(`✅ Copied icons folder to ${path.relative(process.cwd(), destDir)}`);
  } catch (error) {
    console.error('❌ Failed to copy icons folder:', error.message);
  }
};
