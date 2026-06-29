# 项目硬约束（CLAUDE.md 提取）

从 `CLAUDE.md` 提取的硬约束，所有 Taro React 小程序项目适用。

## 分支管理

> 只有在部署时自动合并到 main，其他时间在分支上开发。不要擅自切换到 main 合并或推送，除非用户明确要求。

- 默认在功能分支上开发
- 部署时由 `deploy.sh` 自动合并到 main
- 不要手动 push 到 main

## 部署规范

> 部署前必须先提交代码。必须用户确认后才能执行 `./server/deploy.sh`。不允许在用户未主动要求的情况下自行部署。

- 每次部署前 `git status` 必须干净
- 执行部署前要明确 `do you want me to deploy?`
- 不要主动 deploy

## CSS 字号

> 所有文本字号必须使用 `app.scss` 定义的 CSS 变量（`--fs-xxs` / `--fs-xs` / ...），**禁止写死 px 值**。

详见 `reusable/patterns/css-variables-and-bem.md`。

## 图标/图片

> Icons/images: PNG only for miniprogram assets. SVG is not supported.

- 小程序 assets 只用 PNG，不用 SVG
- 远程图用 `CachedImage`，容器必须有显式 `width` 和 `height`

## API 响应

> API responses: `{ code, message, data, pagination: { page, page_size, total, total_pages } }`.

详见 `reusable/patterns/api-response-format.md`。

## API 切换

> API switching: use `scripts/switch-api.sh local|online`.

跨环境切换用脚本，不要改代码再提交。

## 组件

> Components: use `memo()` for pure display components when following existing patterns.

纯展示组件用 `memo()` 包。

## 订阅授权

> 所有订阅类功能（活动、精灵、版本更新等）必须先调用统一方法 `requestSubscribePermission(templateId)`（`miniprogram/src/utils/subscribeMessage.ts`）拉起微信订阅弹窗，授权通过后再写入后端订阅记录。禁止在页面里重复手写 `wx.requestSubscribeMessage`。

详见 `reusable/patterns/subscribe-message-flow.md` 和 `reusable/utils/subscribeMessage.ts`。

## Database

> Never modify `roco.db` directly with SQL when there is an API endpoint available. Always use the API to ensure all side-effects (e.g. `cleanStoneSource`) are triggered. Never delete WAL/SHM files while a server is running or without first checkpointing.

## 验证方式

> 服务端 `go build`，前端 Taro build，只验证编译错误，不需要启动/重启服务。

不要主动起服务验证；只跑 build 确认编译过。

## 提交规范

> Do not commit binaries or local DB files. `server/server`, `server/server-linux`, and `server/data/roco.db` are ignored.

二进制和 DB 文件不进 git。

## 调试 / 工具

- `agent-browser` 给截图、点网页用，**不要用** `open` 命令
- `scripts/vision.py` 看图（视觉理解）
- `scripts/switch-api.sh` 切环境
