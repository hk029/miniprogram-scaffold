# PageHeader

页面顶部标题区。统一 header 风格，支持返回按钮、标题、描述、可选 visual 视觉元素。

## Props

```ts
interface PageHeaderProps {
  title: string
  description?: string
  visual?: ReactNode       // 右侧自定义视觉元素
  visualImage?: string     // 右侧图片（推荐走 CachedImage）
  paddingTop?: number      // 顶部内边距，默认 52px（适配状态栏）
  className?: string
  showBack?: boolean       // 显示左上角返回按钮
}
```

## 用法

```tsx
<PageHeader
  title="精灵图鉴"
  description="共 287 只精灵"
  showBack
  visualImage="https://cdn.example.com/header.png"
/>
```

## 返回逻辑

- 有上一页 → `Taro.navigateBack()`
- 当前是首页 → `Taro.reLaunch({ url: '/pages/home/index' })`

迁移时改 reLaunch 目标路径。

## 依赖

- `@tarojs/components`（View / Text）
- `@tarojs/taro`（navigateBack / reLaunch）
- SCSS：`./index.scss`
