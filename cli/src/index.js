#!/usr/bin/env node
import { Command } from 'commander'
import inquirer from 'inquirer'
import fs from 'fs-extra'
import path from 'path'
import chalk from 'chalk'
import { scaffold } from './scaffolder.js'

const LAYOUT_CHOICES = [
  { name: 'header-tabbar  - 自定义 Header + 原生 TabBar', value: 'header-tabbar' },
  { name: 'tabbar         - 原生导航栏 + 原生 TabBar', value: 'tabbar' },
  { name: 'fullscreen     - 全屏沉浸式', value: 'fullscreen' },
  { name: 'all            - 全部布局（推荐）', value: 'all' },
]

const SERVER_CHOICES = [
  { name: 'Go (Fiber)', value: 'go' },
  { name: 'Python (FastAPI)', value: 'python' },
]

const program = new Command()

program
  .name('create-mini-scaffold')
  .description('Create Taro + Go/Python mini program projects')
  .version('1.0.0')
  .argument('[project-name]')
  .option('-f, --framework <f>', 'Framework', 'React')
  .option('-c, --css <css>', 'CSS preprocessor', 'Sass')
  .option('-l, --layout <l>', 'Layout: header-tabbar | tabbar | fullscreen | all', 'header-tabbar')
  .option('-s, --server <s>', 'Server: go | python', 'go')
  .option('-p, --port <port>', 'Server port', '8080')
  .option('-y, --yes', 'Skip prompts')
  .option('--overwrite')
  .action(async (name, opts) => {
    try {
      // 1. 确认项目名称
      if (!name) {
        if (opts.yes) {
          name = 'my-mini-app'
        } else {
          const a = await inquirer.prompt([{ type: 'input', name: 'n', message: 'Project name?', default: 'my-mini-app' }])
          name = a.n
        }
      }

      if (!/^[a-zA-Z0-9-_]+$/.test(name)) {
        console.error(chalk.red('Invalid name'))
        process.exit(1)
      }

      const dir = path.join(process.cwd(), name)
      if (await fs.pathExists(dir)) {
        if (!opts.overwrite) {
          if (opts.yes) {
            console.error(chalk.red('Exists. Use --overwrite.'))
            process.exit(1)
          }
          const { o } = await inquirer.prompt([{ type: 'confirm', name: 'o', message: 'Overwrite?', default: false }])
          if (!o) process.exit(0)
        }
        await fs.remove(dir)
      }

      // 2. 交互式确认配置
      const cfg = { framework: opts.framework, css: opts.css, layout: opts.layout, server: opts.server, port: opts.port }

      if (!opts.yes) {
        const a = await inquirer.prompt([
          { type: 'list', name: 'framework', message: 'Framework?', choices: ['React', 'Vue'] },
          { type: 'list', name: 'css', message: 'CSS?', choices: ['Sass', 'Less', 'Stylus', 'None'] },
          { type: 'list', name: 'layout', message: 'Layout?', choices: LAYOUT_CHOICES },
          { type: 'list', name: 'server', message: 'Backend?', choices: SERVER_CHOICES },
          { type: 'input', name: 'port', message: 'Port?', default: cfg.port },
        ])
        Object.assign(cfg, a)
      }

      // 3. 校验
      if (!['header-tabbar', 'tabbar', 'fullscreen', 'all'].includes(cfg.layout)) {
        console.error(chalk.red('Invalid layout'))
        process.exit(1)
      }
      if (!['go', 'python'].includes(cfg.server)) {
        console.error(chalk.red('Invalid server'))
        process.exit(1)
      }

      // 4. 执行脚手架
      console.log(chalk.blue('\nCreating...'))
      await scaffold(name, cfg)

      const serverLabel = cfg.server === 'python' ? 'Python (FastAPI)' : 'Go (Fiber)'
      console.log(chalk.green('\n✓ Done!'))
      console.log(chalk.cyan(`  Layout: ${cfg.layout} | Server: ${serverLabel}`))
      console.log(chalk.white(`\n  cd ${name} && cd miniprogram && pnpm install && pnpm dev:weapp`))
    } catch (e) {
      console.error(chalk.red('Error:'), e)
      process.exit(1)
    }
  })

program.parse()
