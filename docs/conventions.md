# 项目规范

## 分支管理
- 功能分支开发，部署时自动合并 main
- 不要手动 push 到 main

## 部署
- 部署前 git status 干净，用户确认后执行

## CSS
- 字号用 CSS 变量 `var(--fs-xxl)`，禁止写死 px
- 类名遵循 BEM `.block__element--modifier`

## 图片
- PNG only，不用 SVG
- `<Image>` 容器必须有显式 width/height

## API
- `{ code: 0, message, data, pagination }`

## 组件
- 纯展示组件用 `memo()` 包裹

## 验证
- 只跑 build 确认编译通过，不要起服务
