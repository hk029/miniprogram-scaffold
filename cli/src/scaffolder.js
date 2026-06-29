/**
 * 脚手架核心逻辑：复制模板、生成配置
 */
import fs from 'fs-extra'
import path from 'path'
import { LAYOUTS, SERVERS } from './templates.js'

/**
 * 生成 app.config.ts 内容
 */
function generateAppConfig(pages, tabbar) {
  const pagesStr = pages.map(p => `    '${p}'`).join(',\n')
  let tabbarStr = ''
  if (tabbar.length) {
    const list = tabbar
      .map(t => `      { ${Object.entries(t).map(([k, v]) => `${k}: '${v}'`).join(', ')} }`)
      .join(',\n')
    tabbarStr = `\n  tabBar: {\n    color: '#999999', selectedColor: '#1890ff', backgroundColor: '#ffffff', borderStyle: 'black',\n    list: [\n${list},\n    ],\n  },`
  }
  return `export default defineAppConfig({
  pages: [
${pagesStr},
  ],${tabbarStr}
  window: { backgroundTextStyle: 'light', navigationBarBackgroundColor: '#ffffff', navigationBarTitleText: 'Mini Scaffold', navigationBarTextStyle: 'black' },
})\n`
}

/**
 * 生成 README 内容
 */
function generateReadme(name, layout, serverType) {
  const layoutLabel = LAYOUTS[layout].label
  const serverLabel = SERVERS[serverType].label
  const startCmd = serverType === 'python'
    ? 'pip install -r requirements.txt && python main.py'
    : 'go mod tidy && go run main.go'

  return `# ${name}

Taro + ${serverLabel} 小程序。

Layout: \`${layout}\` — ${layoutLabel}

## Start

\`\`\`bash
cd miniprogram && pnpm install && pnpm dev:weapp
cd server && ${startCmd}
\`\`\`
`
}

/**
 * 主脚手架函数
 */
export async function scaffold(projectName, config) {
  const { layout, server, port } = config
  const tDir = path.join(__dirname, '..', 'templates')
  const dir = path.join(process.cwd(), projectName)
  const mDir = path.join(dir, 'miniprogram')
  const layoutCfg = LAYOUTS[layout]
  const serverCfg = SERVERS[server]

  // 1. 创建目录
  await fs.ensureDir(mDir)
  await fs.ensureDir(path.join(dir, 'server'))

  // 2. 复制前端模板（跳过 pages，后面按布局复制）
  await fs.copy(path.join(tDir, 'miniprogram'), mDir, {
    filter: s => !path.relative(path.join(tDir, 'miniprogram'), s).startsWith('src/pages'),
  })
  await fs.copy(path.join(tDir, 'miniprogram/src/layouts'), path.join(mDir, 'src/layouts'))

  // 3. 按布局复制页面
  const srcPages = path.join(tDir, 'miniprogram/src/pages')
  const dstPages = path.join(mDir, 'src/pages')
  for (const p of layoutCfg.copy) {
    await fs.copy(path.join(srcPages, p), path.join(dstPages, p))
  }

  // 4. 生成 app.config.ts
  await fs.writeFile(
    path.join(mDir, 'src/app.config.ts'),
    generateAppConfig(layoutCfg.pages, layoutCfg.tabbar),
  )

  // 5. 更新 package.json / project.config.json 名称
  const pj = await fs.readJson(path.join(mDir, 'package.json'))
  pj.name = projectName + '-miniprogram'
  await fs.writeJson(path.join(mDir, 'package.json'), pj, { spaces: 2 })

  const pc = await fs.readJson(path.join(mDir, 'project.config.json'))
  pc.projectname = projectName
  await fs.writeJson(path.join(mDir, 'project.config.json'), pc, { spaces: 2 })

  // 6. 复制后端模板
  await fs.copy(path.join(tDir, serverCfg.template), path.join(dir, 'server'))

  // Go: 修改 go.mod 模块名
  if (server === 'go') {
    const goModPath = path.join(dir, 'server/go.mod')
    let goMod = await fs.readFile(goModPath, 'utf8')
    await fs.writeFile(goModPath, goMod.replace('module mini-scaffold-server', `module ${projectName}-server`))
  }

  // 更新 .env 端口
  const envPath = path.join(dir, 'server/.env')
  const envExamplePath = path.join(dir, 'server/.env.example')
  if (await fs.pathExists(envExamplePath)) {
    let env = await fs.readFile(envExamplePath, 'utf8')
    env = env.replace('PORT=8080', `PORT=${port}`)
    await fs.writeFile(envPath, env)
    await fs.writeFile(envExamplePath, env)
  }

  // 7. 写 README
  await fs.writeFile(path.join(dir, 'README.md'), generateReadme(projectName, layout, server))
}
