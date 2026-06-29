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
 * 生成 CLAUDE.md
 */
function generateClaudeMd(name, config) {
  const { layout, server, port } = config
  const serverLabel = SERVERS[server].label
  const startCmd = server === 'python'
    ? 'pip install -r requirements.txt && python main.py'
    : 'go mod tidy && go run main.go'

  return `# ${name}

## Tech Stack

- Frontend: Taro 3 + React + TypeScript + Sass
- Backend: ${serverLabel}
- Layout: ${layout}

## Commands

\`\`\`bash
cd miniprogram && pnpm install && pnpm dev:weapp   # 前端开发
cd server && ${startCmd}                           # 后端开发
\`\`\`

## Conventions

- CSS 字号用变量 \`var(--fs-xxl)\`，禁止写死 px
- 类名 BEM：\`.block__element--modifier\`
- API 返回 \`{ code: 0, message, data, pagination? }\`
- 纯展示组件用 \`memo()\` 包裹
- PNG only，不用 SVG
- \`<Image>\` 容器必须有显式 width/height

## Project Structure

\`\`\`
├── miniprogram/     # Taro 前端
│   ├── src/layouts/ # 布局组件
│   ├── src/pages/   # 页面
│   └── config/      # 构建配置
├── server/          # ${serverLabel} 后端
├── reusable/        # 可复用组件和工具
├── docs/            # 项目文档
├── CLAUDE.md        # AI 协作规范
└── AGENT.md         # Agent 使用指南
\`\`\`

## Notes

- 部署前确认用户意图，不要主动 deploy
- 不要手动 push 到 main
- 只跑 build 验证编译，不要起服务
`
}

/**
 * 生成 AGENT.md
 */
function generateAgentMd(name, config) {
  const { server } = config
  const serverLabel = SERVERS[server].label
  const startCmd = server === 'python'
    ? 'cd server && pip install -r requirements.txt && python main.py'
    : 'cd server && go mod tidy && go run main.go'

  return `# Agent 使用指南

> 本文件供 AI Agent 阅读，说明如何在这个项目中工作。

## 快速开始

\`\`\`bash
cd miniprogram && pnpm install && pnpm dev:weapp
${startCmd}
\`\`\`

## 开发流程

1. **理解需求** → 读 CLAUDE.md 了解规范
2. **定位代码** → 页面在 \`src/pages/\`，布局在 \`src/layouts/\`
3. **修改代码** → 遵循 BEM、CSS 变量、memo 等规范
4. **验证** → 跑 \`pnpm build:weapp\` 确认编译通过
5. **不要主动部署** → 等用户确认

## 关键路径

| 内容 | 路径 |
|------|------|
| 页面 | \`miniprogram/src/pages/\` |
| 布局 | \`miniprogram/src/layouts/\` |
| 样式变量 | \`miniprogram/src/styles/variables.scss\` |
| 后端入口 | \`server/main.${server === 'python' ? 'py' : 'go'}\` |
| 项目规范 | \`CLAUDE.md\` |
| 设计系统 | \`docs/design-tokens.md\` |
| API 约定 | \`docs/api-conventions.md\` |
| 可复用组件 | \`reusable/components/\` |
| 踩坑文档 | \`reusable/patterns/\` |

## 禁忌

- 不要写死 px 字号
- 不要用 SVG 做小程序图标
- 不要手写 \`wx.requestSubscribeMessage\`
- 不要直接操作数据库
- 不要主动 deploy
- 不要 push 到 main（除非用户明确要求）

## 文件变更检查清单

- 改了页面 → 检查 \`app.config.ts\` 的 pages 是否需要更新
- 改了组件 → 检查是否需要 \`memo()\`
- 改了样式 → 检查是否用了 CSS 变量
- 新增依赖 → 确认是小程序兼容的包
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

  // 7. 复制 reusable 和 docs
  const repoRoot = path.join(tDir, '..', '..')
  await fs.copy(path.join(repoRoot, 'reusable'), path.join(dir, 'reusable'))
  await fs.copy(path.join(repoRoot, 'docs'), path.join(dir, 'docs'))

  // 8. 生成 CLAUDE.md 和 AGENT.md
  await fs.writeFile(path.join(dir, 'CLAUDE.md'), generateClaudeMd(projectName, config))
  await fs.writeFile(path.join(dir, 'AGENT.md'), generateAgentMd(projectName, config))

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
