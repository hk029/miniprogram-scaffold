# {{PROJECT_NAME}}

## 技术栈

- 前端：Taro 3 + React + TypeScript + Sass
- 后端：{{SERVER_LABEL}}
- 布局：{{LAYOUT}}

## 常用命令

```bash
cd miniprogram && pnpm install && pnpm dev:weapp   # 前端开发
cd server && {{START_CMD}}                         # 后端开发
```

## 项目规范

- CSS 字号用变量 `var(--fs-xxl)`，禁止写死 px
- 类名 BEM：`.block__element--modifier`
- API 返回 `{ code: 0, message, data, pagination? }`
- 纯展示组件用 `memo()` 包裹
- PNG only，不用 SVG
- `<Image>` 容器必须有显式 width/height

## 项目结构

```
├── miniprogram/     # Taro 前端
│   ├── src/layouts/ # 布局组件
│   ├── src/pages/   # 页面
│   └── config/      # 构建配置
├── server/          # {{SERVER_LABEL}} 后端
├── reusable/        # 可复用组件和工具
├── docs/            # 项目文档
├── CLAUDE.md        # AI 协作规范
└── AGENT.md         # Agent 使用指南
```

## 可复用资产

`reusable/` 包含可直接复用的组件、工具和踩坑文档：

### 组件（reusable/components/）

| 组件 | 说明 |
|------|------|
| CachedImage | 远程图本地缓存 |
| AppNoticeModal | 公告弹窗 |
| AnnouncementModal | 系统公告 |
| PageHeader | 页面标题区 |
| Page | 页面容器壳 |
| GlobalFab | 全局浮动按钮 |
| Confetti | 撒花特效 |
| SearchBar | 搜索输入条 |
| DetailCard | 详情卡片壳 |

### 工具（reusable/utils/）

- `subscribeMessage.ts` — 微信订阅消息统一封装
- `obfuscate.ts` — Base64 + JSON 混淆

### 踩坑文档（reusable/patterns/）

- bundle-size-optimization / ios-date-parse / wxss-compatibility
- taro-build-gotchas / local-image-imports / page-scroll-and-tabbar
- css-variables-and-bem / cached-image-container-size
- api-response-format / subscribe-message-flow
- blue-green-deployment / smoke-test

## 注意事项

- 部署前确认用户意图，不要主动 deploy
- 不要手动 push 到 main
- 只跑 build 验证编译，不要起服务
