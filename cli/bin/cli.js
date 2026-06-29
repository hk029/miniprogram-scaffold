#!/usr/bin/env node

const { Command } = require('commander');
const inquirer = require('inquirer');
const fs = require('fs-extra');
const path = require('path');
const chalk = require('chalk');

const program = new Command();

program
  .name('create-mini-scaffold')
  .description('Create Taro + Go mini program projects')
  .version('1.0.0')
  .argument('[project-name]', 'Project name')
  .option('-f, --framework <framework>', 'Framework to use (React/Vue)', 'React')
  .option('-c, --css <preprocessor>', 'CSS preprocessor (Sass/Less/Stylus/None)', 'Sass')
  .option('-p, --port <port>', 'Server port', '8080')
  .option('-y, --yes', 'Skip prompts and use defaults')
  .option('--overwrite', 'Overwrite existing directory')
  .action(async (projectName, options) => {
    try {
      // If project name not provided, ask for it
      if (!projectName) {
        if (options.yes) {
          projectName = 'my-mini-app';
        } else {
          const answers = await inquirer.prompt([
            {
              type: 'input',
              name: 'projectName',
              message: 'What is your project name?',
              default: 'my-mini-app'
            }
          ]);
          projectName = answers.projectName;
        }
      }

      // Validate project name
      if (!/^[a-zA-Z0-9-_]+$/.test(projectName)) {
        console.error(chalk.red('Error: Project name can only contain letters, numbers, hyphens, and underscores'));
        process.exit(1);
      }

      const targetDir = path.join(process.cwd(), projectName);
      
      // Check if directory already exists
      if (await fs.pathExists(targetDir)) {
        if (!options.overwrite) {
          if (options.yes) {
            console.error(chalk.red(`Directory ${projectName} already exists. Use --overwrite to overwrite.`));
            process.exit(1);
          }
          
          const { overwrite } = await inquirer.prompt([
            {
              type: 'confirm',
              name: 'overwrite',
              message: `Directory ${projectName} already exists. Overwrite?`,
              default: false
            }
          ]);
          
          if (!overwrite) {
            console.log(chalk.yellow('Operation cancelled'));
            process.exit(0);
          }
        }
        
        await fs.remove(targetDir);
      }

      // Configuration
      const config = {
        framework: options.framework,
        cssPreprocessor: options.css,
        serverPort: options.port
      };

      // Ask for configuration options if not using --yes
      if (!options.yes) {
        const answers = await inquirer.prompt([
          {
            type: 'list',
            name: 'framework',
            message: 'Which framework do you want to use?',
            choices: ['React', 'Vue'],
            default: config.framework
          },
          {
            type: 'list',
            name: 'cssPreprocessor',
            message: 'Which CSS preprocessor do you want to use?',
            choices: ['Sass', 'Less', 'Stylus', 'None'],
            default: config.cssPreprocessor
          },
          {
            type: 'input',
            name: 'serverPort',
            message: 'What port should the Go server run on?',
            default: config.serverPort
          }
        ]);
        
        config.framework = answers.framework;
        config.cssPreprocessor = answers.cssPreprocessor;
        config.serverPort = answers.serverPort;
      }

      console.log(chalk.blue('\nCreating project...'));
      
      // Copy templates
      await copyTemplates(projectName, config);
      
      console.log(chalk.green('\n✓ Project created successfully!'));
      console.log(chalk.cyan('\nNext steps:'));
      console.log(chalk.white(`  cd ${projectName}`));
      console.log(chalk.white('  # Start frontend:'));
      console.log(chalk.white('  cd miniprogram && npm install && npm run dev:weapp'));
      console.log(chalk.white('  # Start backend:'));
      console.log(chalk.white('  cd server && go run main.go'));
      
    } catch (error) {
      console.error(chalk.red('Error creating project:'), error);
      process.exit(1);
    }
  });

async function copyTemplates(projectName, config) {
  const targetDir = path.join(process.cwd(), projectName);
  const templateDir = path.join(__dirname, '..', '..', 'templates');
  
  // Create project structure
  await fs.ensureDir(path.join(targetDir, 'miniprogram'));
  await fs.ensureDir(path.join(targetDir, 'server'));
  
  // Copy miniprogram template
  await copyMiniprogramTemplate(targetDir, config);
  
  // Copy server template
  await copyServerTemplate(targetDir, config);
  
  // Create root README
  await createRootReadme(targetDir, projectName, config);
}

async function copyMiniprogramTemplate(targetDir, config) {
  const templateDir = path.join(__dirname, '..', '..', 'templates', 'miniprogram');
  const targetMiniprogramDir = path.join(targetDir, 'miniprogram');
  
  // Copy all template files
  await fs.copy(templateDir, targetMiniprogramDir);
  
  // Update package.json with correct name
  const packageJsonPath = path.join(targetMiniprogramDir, 'package.json');
  const packageJson = await fs.readJson(packageJsonPath);
  packageJson.name = path.basename(targetDir) + '-miniprogram';
  await fs.writeJson(packageJsonPath, packageJson, { spaces: 2 });
  
  // Update project.config.json
  const projectConfigPath = path.join(targetMiniprogramDir, 'project.config.json');
  const projectConfig = await fs.readJson(projectConfigPath);
  projectConfig.projectname = path.basename(targetDir);
  await fs.writeJson(projectConfigPath, projectConfig, { spaces: 2 });
}

async function copyServerTemplate(targetDir, config) {
  const templateDir = path.join(__dirname, '..', '..', 'templates', 'server');
  const targetServerDir = path.join(targetDir, 'server');
  
  // Copy all template files
  await fs.copy(templateDir, targetServerDir);
  
  // Update go.mod with correct module name
  const goModPath = path.join(targetServerDir, 'go.mod');
  let goModContent = await fs.readFile(goModPath, 'utf8');
  goModContent = goModContent.replace('module mini-scaffold-server', `module ${path.basename(targetDir)}-server`);
  await fs.writeFile(goModPath, goModContent);
  
  // Update .env with correct port
  const envPath = path.join(targetServerDir, '.env');
  let envContent = await fs.readFile(envPath, 'utf8');
  envContent = envContent.replace('PORT=8080', `PORT=${config.serverPort}`);
  await fs.writeFile(envPath, envContent);
  
  // Update .env.example with correct port
  const envExamplePath = path.join(targetServerDir, '.env.example');
  let envExampleContent = await fs.readFile(envExamplePath, 'utf8');
  envExampleContent = envExampleContent.replace('PORT=8080', `PORT=${config.serverPort}`);
  await fs.writeFile(envExamplePath, envExampleContent);
}

async function createRootReadme(targetDir, projectName, config) {
  const readmeContent = `# ${projectName}

A mini program built with Taro (frontend) and Go (backend).

## Project Structure

\`\`\`
${projectName}/
├── miniprogram/     # Taro frontend
│   ├── src/         # Source code
│   ├── config/      # Taro config
│   └── package.json
├── server/          # Go backend
│   ├── main.go      # Entry point
│   ├── handler/     # HTTP handlers
│   ├── go.mod       # Go module
│   └── go.sum       # Go dependencies
└── README.md
\`\`\`

## Getting Started

### Prerequisites

- Node.js >= 16
- Go >= 1.21
- WeChat Developer Tools

### Frontend (Taro)

1. Install dependencies:
   \`\`\`bash
   cd miniprogram
   npm install
   \`\`\`

2. Start development server:
   \`\`\`bash
   npm run dev:weapp
   \`\`\`

3. Open WeChat Developer Tools and import the \`miniprogram\` directory.

### Backend (Go)

1. Install dependencies:
   \`\`\`bash
   cd server
   go mod tidy
   \`\`\`

2. Start the server:
   \`\`\`bash
   go run main.go
   \`\`\`

The server will run on port ${config.serverPort}.

## API Endpoints

- \`GET /api/hello\` - Returns a hello world message

## Development

### Frontend Development

The frontend is built with Taro and React. Key files:

- \`src/app.tsx\` - App entry point
- \`src/pages/index/index.tsx\` - Main page
- \`config/index.ts\` - Taro configuration

### Backend Development

The backend is built with Go and Fiber. Key files:

- \`main.go\` - Server entry point
- \`handler/hello.go\` - Hello world handler
- \`router/router.go\` - Route definitions

## Building for Production

### Frontend

\`\`\`bash
cd miniprogram
npm run build:weapp
\`\`\`

### Backend

\`\`\`bash
cd server
go build -o server main.go
./server
\`\`\`

## Configuration

### Frontend Configuration

Edit \`miniprogram/config/index.ts\` to configure Taro settings.

### Backend Configuration

Edit \`server/.env\` to configure server settings:

\`\`\`env
PORT=8080
GIN_MODE=release
\`\`\`

## License

MIT
`;

  await fs.writeFile(path.join(targetDir, 'README.md'), readmeContent);
}

program.parse();