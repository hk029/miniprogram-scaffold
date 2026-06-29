#!/usr/bin/env node
const { Command } = require('commander');
const inquirer = require('inquirer');
const fs = require('fs-extra');
const path = require('path');
const chalk = require('chalk');
const program = new Command();
program.name('create-mini-scaffold').description('Create Taro + Go mini program projects').version('1.0.0')
  .argument('[project-name]').option('-f, --framework <f>', 'Framework', 'React').option('-c, --css <css>', 'CSS preprocessor', 'Sass')
  .option('-l, --layout <l>', 'Layout: header-tabbar | tabbar | fullscreen | all', 'header-tabbar')
  .option('-p, --port <port>', 'Server port', '8080').option('-y, --yes', 'Skip prompts').option('--overwrite')
  .action(async (name, opts) => {
    try {
      if (!name) { if (opts.yes) name = 'my-mini-app'; else { const a = await inquirer.prompt([{ type: 'input', name: 'n', message: 'Project name?', default: 'my-mini-app' }]); name = a.n; } }
      if (!/^[a-zA-Z0-9-_]+$/.test(name)) { console.error(chalk.red('Invalid name')); process.exit(1); }
      const dir = path.join(process.cwd(), name);
      if (await fs.pathExists(dir)) { if (!opts.overwrite) { if (opts.yes) { console.error(chalk.red('Exists. Use --overwrite.')); process.exit(1); } const { o } = await inquirer.prompt([{ type: 'confirm', name: 'o', message: 'Overwrite?', default: false }]); if (!o) { process.exit(0); } } await fs.remove(dir); }
      const cfg = { framework: opts.framework, css: opts.css, layout: opts.layout, port: opts.port };
      if (!opts.yes) { const a = await inquirer.prompt([
        { type: 'list', name: 'framework', message: 'Framework?', choices: ['React', 'Vue'] },
        { type: 'list', name: 'css', message: 'CSS?', choices: ['Sass', 'Less', 'Stylus', 'None'] },
        { type: 'list', name: 'layout', message: 'Layout?', choices: [
          { name: 'header-tabbar  - 自定义 Header + 原生 TabBar', value: 'header-tabbar' },
          { name: 'tabbar         - 原生导航栏 + 原生 TabBar', value: 'tabbar' },
          { name: 'fullscreen     - 全屏沉浸式', value: 'fullscreen' },
          { name: 'all            - 全部布局（推荐）', value: 'all' }
        ]}, { type: 'input', name: 'port', message: 'Port?', default: cfg.port } ]); Object.assign(cfg, a); }
      if (!['header-tabbar','tabbar','fullscreen','all'].includes(cfg.layout)) { console.error(chalk.red('Invalid layout')); process.exit(1); }
      console.log(chalk.blue('\nCreating...'));
      const tDir = path.join(__dirname, '..', '..', 'templates');
      const mDir = path.join(dir, 'miniprogram');
      await fs.ensureDir(mDir); await fs.ensureDir(path.join(dir, 'server'));
      // Copy miniprogram (skip pages)
      await fs.copy(path.join(tDir, 'miniprogram'), mDir, { filter: s => !path.relative(path.join(tDir, 'miniprogram'), s).startsWith('src/pages') });
      await fs.copy(path.join(tDir, 'miniprogram/src/layouts'), path.join(mDir, 'src/layouts'));
      // Copy pages based on layout
      const sP = path.join(tDir, 'miniprogram/src/pages'), dP = path.join(mDir, 'src/pages');
      let pages = [], tabbar = [];
      if (cfg.layout === 'all') {
        pages = ['pages/home/index','pages/discover/index','pages/mine/index','pages/splash/index'];
        tabbar = [{ pagePath:'pages/home/index',text:'首页',iconPath:'assets/tabbar/home.png',selectedIconPath:'assets/tabbar/home-active.png' },{ pagePath:'pages/discover/index',text:'发现',iconPath:'assets/tabbar/discover.png',selectedIconPath:'assets/tabbar/discover-active.png' },{ pagePath:'pages/mine/index',text:'我的',iconPath:'assets/tabbar/mine.png',selectedIconPath:'assets/tabbar/mine-active.png' }];
        for (const p of ['home','discover','mine','splash']) await fs.copy(path.join(sP, p), path.join(dP, p));
      } else if (cfg.layout === 'header-tabbar') {
        pages = ['pages/home/index']; tabbar = [{ pagePath:'pages/home/index',text:'首页',iconPath:'assets/tabbar/home.png',selectedIconPath:'assets/tabbar/home-active.png' }];
        await fs.copy(path.join(sP, 'home'), path.join(dP, 'home'));
      } else if (cfg.layout === 'tabbar') {
        pages = ['pages/discover/index']; tabbar = [{ pagePath:'pages/discover/index',text:'发现',iconPath:'assets/tabbar/discover.png',selectedIconPath:'assets/tabbar/discover-active.png' }];
        await fs.copy(path.join(sP, 'discover'), path.join(dP, 'discover'));
      } else {
        pages = ['pages/splash/index']; await fs.copy(path.join(sP, 'splash'), path.join(dP, 'splash'));
      }
      // Generate app.config.ts
      const ps = pages.map(p => `    '${p}'`).join(',\n');
      let ts = ''; if (tabbar.length) { const tl = tabbar.map(t => `      { ${Object.entries(t).map(([k,v])=>`${k}: '${v}'`).join(', ')} }`).join(',\n'); ts = `\n  tabBar: {\n    color: '#999999', selectedColor: '#1890ff', backgroundColor: '#ffffff', borderStyle: 'black',\n    list: [\n${tl},\n    ],\n  },`; }
      await fs.writeFile(path.join(mDir, 'src/app.config.ts'), `export default defineAppConfig({\n  pages: [\n${ps},\n  ],${ts}\n  window: { backgroundTextStyle: 'light', navigationBarBackgroundColor: '#ffffff', navigationBarTitleText: 'Mini Scaffold', navigationBarTextStyle: 'black' },\n})\n`);
      // Update names
      const pj = await fs.readJson(path.join(mDir, 'package.json')); pj.name = name + '-miniprogram'; await fs.writeJson(path.join(mDir, 'package.json'), pj, { spaces: 2 });
      const pc = await fs.readJson(path.join(mDir, 'project.config.json')); pc.projectname = name; await fs.writeJson(path.join(mDir, 'project.config.json'), pc, { spaces: 2 });
      // Server
      await fs.copy(path.join(tDir, 'server'), path.join(dir, 'server'));
      let gm = await fs.readFile(path.join(dir, 'server/go.mod'), 'utf8'); await fs.writeFile(path.join(dir, 'server/go.mod'), gm.replace('module mini-scaffold-server', `module ${name}-server`));
      const ep = path.join(dir, 'server/.env.example'); if (await fs.pathExists(ep)) { let e = await fs.readFile(ep, 'utf8'); e = e.replace('PORT=8080', `PORT=${cfg.port}`); await fs.writeFile(path.join(dir, 'server/.env'), e); await fs.writeFile(ep, e); }
      // README
      const nm = { 'header-tabbar': 'HeaderTabBarLayout', 'tabbar': 'TabBarLayout', 'fullscreen': 'FullscreenLayout', 'all': '全部布局' };
      await fs.writeFile(path.join(dir, 'README.md'), `# ${name}\n\nTaro + Go 小程序。\n\nLayout: \`${cfg.layout}\` — ${nm[cfg.layout]}\n\n## Start\n\n\`\`\`bash\ncd miniprogram && npm install && npm run dev:weapp\ncd server && go mod tidy && go run main.go\n\`\`\`\n`);
      console.log(chalk.green('\n✓ Done!')); console.log(chalk.cyan(`  Layout: ${cfg.layout}`)); console.log(chalk.white(`\n  cd ${name} && cd miniprogram && npm install && npm run dev:weapp`));
    } catch (e) { console.error(chalk.red('Error:'), e); process.exit(1); }
  });
program.parse();
