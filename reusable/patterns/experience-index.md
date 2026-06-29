# 经验索引（来自 `experience.md`）

> 单一索引文档，把 `rocokingdom` 项目积累的经验分类、标好复用范围。**实际细节仍在项目 `experience.md` 里**，这里只做导航 + 复用判断。

## 怎么用

- 跨项目可用的：跳到 `reusable/patterns/` 或 `reusable/components/` 对应文档
- 项目特定的：直接读原项目 `experience.md`
- 不确定时查这一篇判断范围

---

## A. 跨项目可复用

| 经验标题 | 复用形式 | 文档 |
|---|---|---|
| 小程序滚动体系：Sticky 与滚动加载的冲突 | pattern | `patterns/page-scroll-and-tabbar.md` |
| 小程序 WXSS 兼容性（nth-child / calc env / SVG） | pattern | `patterns/wxss-compatibility.md` |
| 小程序布局陷阱（inline-flex / ScrollView 位置重置） | pattern | `patterns/page-scroll-and-tabbar.md` |
| ScrollView 内的两列布局 | pattern | `patterns/page-scroll-and-tabbar.md` |
| 图片缓存：CachedImage vs Image | 组件 | `components/CachedImage/README.md` |
| CachedImage 容器尺寸硬规则 | pattern | `patterns/cached-image-container-size.md` |
| downloadFile temp 文件问题（macOS） | 组件 | `components/CachedImage/README.md`（含方案） |
| 推荐配招 CachedImage 在 flex 容器内不显示 | pattern | `patterns/cached-image-container-size.md` |
| 小程序包体积优化：分包 + Terser + 按需注入 | pattern | `patterns/bundle-size-optimization.md` |
| Taro webpack @/ alias 解析失败 | pattern | `patterns/taro-build-gotchas.md` |
| mini-css-extract-plugin Conflicting order 警告 | pattern | `patterns/taro-build-gotchas.md` |
| iOS Date.parse 兼容性：空格转 T | pattern | `patterns/ios-date-parse.md` |
| 微信订阅消息：前后端完整流程 | pattern + util | `patterns/subscribe-message-flow.md` + `utils/subscribeMessage.ts` |
| HTTPS 部署：Let's Encrypt + Nginx 反代 | pattern | `patterns/https-with-nginx.md` |
| 部署踩坑 podman/docker 差异 | pattern | `patterns/deploy-podman-vs-docker.md` |
| 蓝绿部署 | pattern | `patterns/blue-green-deployment.md` |
| Smoke test 工作流 | pattern | `patterns/smoke-test.md` |
| 前端修改默认不跑 Taro 构建 | convention | `conventions/hard-rules.md` |

---

## B. 项目特定（仅 `rocokingdom`）

业务领域或内部工具，不适合复用：

- 蛋尺寸预测算法：v1 vs v2
- 蛋尺寸数据与家族直接绑定
- 小程序用户身份识别与 Profile 页面
- 异色精灵 form_type='shiny' 的 URL 迁移
- pet_builds 表设计与实现
- switch-api.sh 切换 API 无效问题
- 活动奖励图标自动补全逻辑
- Wiki 图片生成：代码块 Schema
- 远行商人系列（双源抓取 / 商品分级 / 预发部署 / 调试接口）
- 订阅系统架构：类型路由 + 匹配器模式
- 订阅通知 message 返回详细错误
- 页面分享 useShare hook
- Go 事务接口返回成功但查询状态未更新
- SQLite datetime 字符串比较与 RFC3339

读 `experience.md` 对应章节。

---

## C. 持续更新

新增经验时：
1. 在 `experience.md` 加新章节
2. 跨项目的同步到 `reusable/patterns/` 或 `components/`
3. 改这一篇索引

---

## 来源

- 项目 `experience.md`（1700+ 行踩坑记录）
- 项目 `CLAUDE.md` Hard Conventions
- 全局 memory（`~/.claude/projects/.../memory/`）里的反馈规则
