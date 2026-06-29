# patterns/

跨项目可复用的模式和约定。每个文件一篇，按需查阅。

## 文档

| 文件 | 主题 |
|---|---|
| `experience-index.md` | **经验总索引**：把 experience.md 章节分类、标好复用范围 |
| `api-response-format.md` | API `{code,message,data,pagination}` 约定 |
| `subscribe-message-flow.md` | 订阅消息授权流程（前置检查） |
| `cached-image-container-size.md` | `<Image>` / `<CachedImage>` 容器必须有显式宽高 |
| `css-variables-and-bem.md` | 字号用 CSS 变量，类名 BEM |
| `wxss-compatibility.md` | WXSS 不支持 nth-child / calc(env) / SVG 等 |
| `page-scroll-and-tabbar.md` | 页面滚动 + 吸顶 Tab + 触底加载 |
| `bundle-size-optimization.md` | 主包 1.5MB 限制：分包 + Terser + 按需注入 |
| `taro-build-gotchas.md` | Taro 构建常见坑（@/ alias / CSS 顺序 / Go 工具链） |
| `ios-date-parse.md` | iOS Safari 严格 ISO8601，空格分隔要转 T |
| `local-image-imports.md` | 本地 PNG/JPG 用 ES import，集中常量文件 |
| `blue-green-deployment.md` | 蓝绿部署架构（项目已落地，可借鉴） |
| `smoke-test.md` | 部署后跑 `scripts/smoke_test.py` 冒烟 |
