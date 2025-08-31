#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// --- recomp: A React Component Generator CLI ---

// Function to display help information
function showHelp() {
  console.log(`
recomp - A React Component Generator

Usage:
  recomp gen <component-name> [directory]
  recomp --help

Commands:
  gen         Generates a new component.
              <component-name> is required (e.g., 'my-button').
              [directory] is optional. Defaults to './src/components'.

Options:
  -h, --help  Show this help message.

Example:
  recomp gen user-profile
  recomp gen card ./src/common
  `);
}

// Function to generate the component
function generateComponent(folderName, srcDir = './src/components') {
  // --- Validation ---
  if (!folderName) {
    console.error('❌ Error: Component name is required.');
    showHelp();
    process.exit(1);
  }

  // --- Variables ---
  // Convert folder name (e.g., "my-button") to PascalCase (e.g., "MyButton")
  const componentName = folderName
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join('');

  const componentDir = path.join(srcDir, folderName);

  // Check if the directory already exists
  if (fs.existsSync(componentDir)) {
    console.error(`❌ Error: Component directory '${componentDir}' already exists.`);
    process.exit(1);
  }

  // --- Scaffolding ---
  console.log(`🚀 Creating component '${componentName}' in '${componentDir}'...`);

  // 1. Create directory
  fs.mkdirSync(componentDir, { recursive: true });
  console.log(`   -> Created directory: ${componentDir}`);

  // 2. Create index.ts
  const indexFile = path.join(componentDir, 'index.ts');
  const indexContent = `export { default } from './${componentName}';\nexport { default as ${componentName}Styles } from './${componentName}.module.css';\n`;
  fs.writeFileSync(indexFile, indexContent);
  console.log(`   -> Created file:      ${indexFile}`);

  // 3. Create CSS module
  const cssFile = path.join(componentDir, `${componentName}.module.css`);
  fs.writeFileSync(cssFile, ''); // Create an empty file
  console.log(`   -> Created file:      ${cssFile}`);
  
  // 4. Create TSX component file
  const tsxFile = path.join(componentDir, `${componentName}.tsx`);
  const tsxContent = `import React from 'react';
import styles from './${componentName}.module.css';

interface ${componentName}Props {
  // Define your component's props here
}

const ${componentName}: React.FC<${componentName}Props> = () => {
  return (
    <div className={styles.root}>
      <h1>${componentName}</h1>
    </div>
  );
};

export default ${componentName};
`;
  fs.writeFileSync(tsxFile, tsxContent);
  console.log(`   -> Created file:      ${tsxFile}`);

  console.log(`✅ Component '${componentName}' created successfully!`);
}

// --- Main CLI Logic ---
const args = process.argv.slice(2);
const command = args[0];

switch (command) {
  case 'gen':
    generateComponent(args[1], args[2]);
    break;
  case '-h':
  case '--help':
    showHelp();
    break;
  case undefined:
    console.error('❌ Error: No command provided.');
    showHelp();
    break;
  default:
    console.error(`❌ Error: Unknown command '${command}'`);
    showHelp();
    process.exit(1);
}
