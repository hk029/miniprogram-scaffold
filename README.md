# create-miniprogram-scaffold

[![npm version](https://img.shields.io/npm/v/create-miniprogram-scaffold.svg)](https://www.npmjs.com/package/create-miniprogram-scaffold)
[![license](https://img.shields.io/npm/l/create-miniprogram-scaffold.svg)](https://github.com/hk029/miniprogram-scaffold/blob/main/LICENSE)

快速创建 Taro + Go 微信小程序项目的脚手架工具。

## 安装 & 使用

```bash
npm create miniprogram-scaffold my-app
```

或

```bash
npx create-miniprogram-scaffold my-app
```

### 命令行参数

| 参数 | 说明 | 默认值 |
|------|------|--------|
| `-l, --layout` | 页面布局模式 | header-tabbar |
| `-f, --framework` | 前端框架 (React/Vue) | React |
| `-c, --css` | CSS 预处理器 (Sass/Less/Stylus/None) | Sass |
| `-p, --port` | Go 后端端口 | 8080 |
| `-y, --yes` | 跳过交互式提示 | false |
| `--overwrite` | 覆盖已存在的目录 | false |

### 布局模式

| 模式 | Header | TabBar | 适用场景 |
|------|--------|--------|----------|
| `header-tabbar` | ✅ 自定义 | ✅ 原生 | 品牌化首页、核心 Tab 页 |
| `tabbar` | 原生 | ✅ 原生 | 标准列表页、发现页、个人中心 |
| `fullscreen` | ❌ 无 | ❌ 无 | 启动页、引导页、全屏活动页 |
| `all` | 全部 | 全部 | 推荐：每个布局一个示例页 |

```bash
# 全部布局（推荐）
npm create miniprogram-scaffold my-app --layout all

# 只要全屏布局
npm create miniprogram-scaffold my-app --layout fullscreen

# 跳过提示，使用默认值
npm create miniprogram-scaffold my-app -y
```

## 创建后的项目结构

```
my-app/
├── miniprogram/           # Taro 前端
│   ├── src/
│   │   ├── layouts/       # 布局组件（FullscreenLayout / TabBarLayout / HeaderTabBarLayout）
│   │   ├── pages/         # 页面（根据 --layout 生成）
│   │   ├── styles/        # 设计变量 variables.scss
│   │   ├── app.tsx
│   │   └── app.config.ts  # 根据 --layout 动态生成
│   ├── config/            # Taro 构建配置
│   ├── assets/tabbar/     # TabBar 图标（占位 PNG）
│   └── package.json
├── server/                # Go Fiber 后端
│   ├── main.go
│   ├── go.mod
│   └── .env
└── docs/                  # 项目文档（规范 / 设计系统 / API / 部署）
```

## 快速开始

```bash
cd my-app

# 启动前端
cd miniprogram
npm install
npm run dev:weapp

# 启动后端（新终端）
cd server
go mod tidy
go run main.go
```

打开微信开发者工具，导入 `miniprogram/` 目录即可预览。

## 文档

| 文档 | 说明 |
|------|------|
| [conventions.md](docs/conventions.md) | 项目规范（分支、CSS、API、组件等） |
| [design-tokens.md](docs/design-tokens.md) | 设计系统（CSS 变量、颜色、字号） |
| [api-conventions.md](docs/api-conventions.md) | API 响应格式约定 |
| [deployment.md](docs/deployment.md) | 部署方案（蓝绿部署、冒烟测试） |
| [components.md](docs/components.md) | 可复用组件清单 |

## 可复用资产

`reusable/` 目录包含从实际项目提取的可复用组件、工具和踩坑文档：

- **9 个组件**：CachedImage / AppNoticeModal / PageHeader / Page / GlobalFab / Confetti / SearchBar / AnnouncementModal / DetailCard
- **工具**：subscribeMessage（订阅消息）、obfuscate（混淆）
- **踩坑文档**：bundle-size / ios-date / wxss-compat / taro-build 等

## Release / 发布

### 流程

1. **改版本号**：修改 `cli/package.json` 中的 `version`
2. **提交 & 推送**
3. **打 tag**
4. **创建 GitHub Release**（触发 npm publish）

### 具体步骤

```bash
# 1. 修改 cli/package.json 的 version 字段
# 例如: "version": "1.0.2"

# 2. 提交
cli/bin/cli.js  # 确认改动
git add -A
git commit -m "release: v1.0.2"
git push origin main

# 3. 打 tag
git tag -a v1.0.2 -m "v1.0.2"
git push origin v1.0.2

# 4. 创建 GitHub Release（会自动触发 npm publish）
gh release create v1.0.2 --title "v1.0.2" --notes "变更说明"
```

### 注意事项

- **必须先改 `cli/package.json` 的 version**，否则 npm publish 会报 403（版本已存在）
- **必须创建 GitHub Release**（不是只推 tag），workflow 触发条件是 `release: types: [published]`
- **tag 名称和 release 标题要一致**，如都用 `v1.0.2`
- 如果 release 创建失败需要重来：先 `gh release delete v1.0.2 -y` 删旧的，再重新 create

### 自动化

发布由 `.github/workflows/publish.yml` 自动完成：
- 触发条件：GitHub Release published
- 构建：`cd cli && npm install && npm publish --provenance --access public`
- 需要在 repo Settings → Secrets 中配置 `NPM_TOKEN`

## License

MIT
