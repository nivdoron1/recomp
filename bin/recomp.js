#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// --- recomp: A React Component/Context/Hook Generator CLI ---

// --- Helper Functions for Naming Conventions ---

/**
 * Converts a kebab-case string to PascalCase.
 * Example: 'user-profile' -> 'UserProfile'
 * @param {string} str The input string in kebab-case.
 * @returns {string} The converted string in PascalCase.
 */
function kebabToPascalCase(str) {
  if (!str) return '';
  return str
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join('');
}

// --- Help Information ---

function showHelp() {
  console.log(`
recomp - A React/Context/Hook Generator

Usage:
  recomp gen <type> <name> [directory] [flags]

Commands:
  gen <type>    Generates a new component, context, or hook.
                <type> must be 'component', 'context', or 'hook'.
                <name> is required (e.g., 'user-profile' or 'toggle').
                [directory] is optional. Defaults to './src/components', './src/contexts', or './src/hooks'.

Component Flags:
  --no-types      Skip creating the '{name}.types.ts' file.
  --no-css        Skip creating the '{name}.module.css' file.
  --no-index      Skip creating the 'index.ts' file.
  --no-all        Skip creating all optional files for a component.

Context Flags:
  --no-types      Skip creating the '{name}Context.types.ts' file.
  --no-index      Skip creating the 'index.ts' file.
  --no-all        Skip creating all optional files for a context.

Hook Flags:
  --no-types      Skip creating the '{name}.types.ts' file.
  --no-index      Skip creating the 'index.ts' file.
  --no-all        Skip creating all optional files for a hook.

Options:
  -h, --help      Show this help message.

Examples:
  recomp gen component user-profile
  recomp gen context user-settings ./src/state
  recomp gen hook use-toggle ./src/lib
  recomp gen hook debounce --no-types
  `);
}

// --- Generator for React Components ---
function generateComponent(kebabName, srcDir = './src/components', options) {
  if (!kebabName) {
    console.error('❌ Error: Component name is required.');
    showHelp();
    process.exit(1);
  }

  const componentName = kebabToPascalCase(kebabName);
  const componentDir = path.join(srcDir, componentName); // Folder is PascalCase

  if (fs.existsSync(componentDir)) {
    console.error(`❌ Error: Component directory '${componentDir}' already exists.`);
    process.exit(1);
  }

  console.log(`🚀 Creating component '${componentName}' in '${componentDir}'...`);
  fs.mkdirSync(componentDir, { recursive: true });
  console.log(`   -> Created directory: ${componentDir}`);

  if (options.createIndex) {
    const indexFile = path.join(componentDir, 'index.ts');
    let indexContent = `export { default } from './${componentName}';\n`;
    if (options.createCss) {
        indexContent += `export { default as ${componentName}Styles } from './${componentName}.module.css';\n`;
    }
    if (options.createTypes) {
        indexContent += `export * from './${componentName}.types';\n`;
    }
    fs.writeFileSync(indexFile, indexContent);
    console.log(`   -> Created file:      ${indexFile}`);
  }

  if (options.createCss) {
    const cssFile = path.join(componentDir, `${componentName}.module.css`);
    const cssContent = `.root {\n  /* Add your styles here */\n}\n`;
    fs.writeFileSync(cssFile, cssContent);
    console.log(`   -> Created file:      ${cssFile}`);
  }
  
  if (options.createTypes) {
    const typesFile = path.join(componentDir, `${componentName}.types.ts`);
    const typesContent = `export interface ${componentName}Props {\n  // Define your component's props here\n}\n`;
    fs.writeFileSync(typesFile, typesContent);
    console.log(`   -> Created file:      ${typesFile}`);
  }
  
  const tsxFile = path.join(componentDir, `${componentName}.tsx`);
  const cssImport = options.createCss ? `import styles from './${componentName}.module.css';\n` : '';
  const typesImport = options.createTypes ? `import type { ${componentName}Props } from './${componentName}.types';\n` : '';
  const propsUsage = options.createTypes ? `props: ${componentName}Props` : '';
  const classNameAttr = options.createCss ? `className={styles.root}` : '';
  
  const tsxContent = `import React from 'react';
${cssImport}${typesImport}
const ${componentName}: React.FC<${options.createTypes ? `${componentName}Props` : '{}'}> = (${propsUsage}) => {
  return (
    <div ${classNameAttr}>
      <h1>${componentName}</h1>
    </div>
  );
};

export default ${componentName};
`;
  fs.writeFileSync(tsxFile, tsxContent);
  console.log(`   -> Created file:      ${tsxFile}`);
  console.log(`\n✅ Component '${componentName}' created successfully!`);
}

// --- Generator for React Context ---
function generateContext(kebabName, srcDir = './src/contexts', options) {
  if (!kebabName) {
    console.error('❌ Error: Context name is required.');
    showHelp();
    process.exit(1);
  }

  const contextBaseName = kebabToPascalCase(kebabName); // user-profile -> UserProfile
  const contextDirName = `${contextBaseName}Context`; // UserProfileContext
  const contextDir = path.join(srcDir, contextDirName);

  if (fs.existsSync(contextDir)) {
    console.error(`❌ Error: Context directory '${contextDir}' already exists.`);
    process.exit(1);
  }

  console.log(`🚀 Creating context '${contextBaseName}' in '${contextDir}'...`);
  fs.mkdirSync(contextDir, { recursive: true });
  console.log(`   -> Created directory: ${contextDir}`);

  if (options.createIndex) {
    const indexFile = path.join(contextDir, 'index.ts');
    let indexContent = `export * from './${contextDirName}';\n`;
    if (options.createTypes) {
      indexContent += `export * from './${contextDirName}.types';\n`;
    }
    fs.writeFileSync(indexFile, indexContent);
    console.log(`   -> Created file:      ${indexFile}`);
  }

  if (options.createTypes) {
    const typesFile = path.join(contextDir, `${contextDirName}.types.ts`);
    const typesContent = `// The main data structure for the context's state
export interface ${contextBaseName}State {
  // TODO: Define your state properties here
}

// The complete context value, including state and actions
export interface ${contextBaseName}ContextType extends ${contextBaseName}State {
  // TODO: Define your context actions here
}
`;
    fs.writeFileSync(typesFile, typesContent);
    console.log(`   -> Created file:      ${typesFile}`);
  }
  
  const tsxFile = path.join(contextDir, `${contextDirName}.tsx`);
  const typesImport = options.createTypes 
    ? `import type { ${contextBaseName}ContextType, ${contextBaseName}State } from './${contextDirName}.types';\n` 
    : '';
  const inlineTypes = !options.createTypes 
    ? `export interface ${contextBaseName}State {\n  // TODO: Define your state properties here\n}\n\nexport interface ${contextBaseName}ContextType extends ${contextBaseName}State {\n  // TODO: Define your context actions here\n}\n\n` 
    : '';

  const tsxContent = `import React, { createContext, useContext, useState } from 'react';
${typesImport}
${inlineTypes}// Create the context with a default undefined value
const ${contextBaseName}Context = createContext<${contextBaseName}ContextType | undefined>(undefined);

const initialState: ${contextBaseName}State = {
  // TODO: Set initial values for your state here
};

interface ${contextBaseName}ProviderProps {
  children: React.ReactNode;
}

export const ${contextBaseName}Provider: React.FC<${contextBaseName}ProviderProps> = ({ children }) => {
  const [state, setState] = useState<${contextBaseName}State>(initialState);

  const contextValue: ${contextBaseName}ContextType = {
    ...state,
  };

  return (
    <${contextBaseName}Context.Provider value={contextValue}>
      {children}
    </${contextBaseName}Context.Provider>
  );
};

export const use${contextBaseName} = (): ${contextBaseName}ContextType => {
  const context = useContext(${contextBaseName}Context);
  if (context === undefined) {
    throw new Error('use${contextBaseName} must be used within a ${contextBaseName}Provider');
  }
  return context;
};
`;
  fs.writeFileSync(tsxFile, tsxContent);
  console.log(`   -> Created file:      ${tsxFile}`);
  console.log(`\n✅ Context '${contextBaseName}' created successfully!`);
}

// --- Generator for React Hooks ---
function generateHook(kebabName, srcDir = './src/hooks', options) {
  if (!kebabName) {
    console.error('❌ Error: Hook name is required.');
    showHelp();
    process.exit(1);
  }

  // Sanitize input: remove potential 'use-' prefix for base name calculation
  const baseKebabName = kebabName.startsWith('use-') ? kebabName.substring(4) : kebabName;
  const basePascalName = kebabToPascalCase(baseKebabName); // user-profile -> UserProfile
  
  const hookName = `use${basePascalName}`; // useUserProfile
  const hookDirName = `${basePascalName}`; // UserProfileHook
  const hookDir = path.join(srcDir, hookDirName);

  if (fs.existsSync(hookDir)) {
    console.error(`❌ Error: Hook directory '${hookDir}' already exists.`);
    process.exit(1);
  }

  console.log(`🚀 Creating hook '${hookName}' in '${hookDir}'...`);
  fs.mkdirSync(hookDir, { recursive: true });
  console.log(`   -> Created directory: ${hookDir}`);
  
  if (options.createIndex) {
    const indexFile = path.join(hookDir, 'index.ts');
    let indexContent = `export * from './${hookName}';\n`;
    if (options.createTypes) {
      indexContent += `export * from './${hookName}.types';\n`;
    }
    fs.writeFileSync(indexFile, indexContent);
    console.log(`   -> Created file:      ${indexFile}`);
  }

  if (options.createTypes) {
    const typesFile = path.join(hookDir, `${hookName}.types.ts`);
    const typesContent = `// Define argument and return types for your hook
export interface ${hookName}Options {
  // ...
}

export type ${hookName}Return = void;
`;
    fs.writeFileSync(typesFile, typesContent);
    console.log(`   -> Created file:      ${typesFile}`);
  }

  const tsFile = path.join(hookDir, `${hookName}.ts`);
  const typesImport = options.createTypes 
    ? `import type { ${hookName}Options, ${hookName}Return } from './${hookName}.types';\n` 
    : '';
  const propsUsage = options.createTypes ? `options: ${hookName}Options` : '';
  const returnType = options.createTypes ? `: ${hookName}Return` : '';

  const tsContent = `import { useState, useEffect } from 'react';
${typesImport}
export const ${hookName} = (${propsUsage})${returnType} => {
  // TODO: Implement your hook logic here
  
  // Example:
  // const [value, setValue] = useState(null);
  // useEffect(() => {
  //   // ...
  // }, []);

  // return value;
};

export default ${hookName};
`;
  fs.writeFileSync(tsFile, tsContent);
  console.log(`   -> Created file:      ${tsFile}`);
  console.log(`\n✅ Hook '${hookName}' created successfully!`);
}

// --- Main CLI Logic ---
function main() {
  const args = process.argv.slice(2);
  const command = args[0];

  if (args.includes('-h') || args.includes('--help')) {
    showHelp();
    return;
  }
  
  if (command !== 'gen') {
    if (command) {
        console.error(`❌ Error: Unknown command '${command}'.`);
    } else {
        console.error('❌ Error: No command provided.');
    }
    showHelp();
    process.exit(1);
  }

  const type = args[1];
  const remainingArgs = args.slice(2);
  
  const flags = remainingArgs.filter(arg => arg.startsWith('--'));
  const positionalArgs = remainingArgs.filter(arg => !arg.startsWith('--'));
  
  const name = positionalArgs[0];
  const directory = positionalArgs[1]; // Can be undefined, functions will use defaults
  
  const noAll = flags.includes('--no-all');
  const options = {
    createTypes: !flags.includes('--no-types') && !noAll,
    createCss: !flags.includes('--no-css') && !noAll,
    createIndex: !flags.includes('--no-index') && !noAll,
  };

  switch (type) {
    case 'component':
      generateComponent(name, directory, options);
      break;
    case 'context':
      generateContext(name, directory, options);
      break;
    case 'hook':
      generateHook(name, directory, options);
      break;
    default:
      console.error(`❌ Error: Unknown generator type '${type}'. Use 'component', 'context', or 'hook'.`);
      showHelp();
      process.exit(1);
  }
}

main();
