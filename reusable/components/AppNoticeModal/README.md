# AppNoticeModal

应用内公告/提示模态框。基于 Taro `RootPortal` 渲染（脱离页面层级，z-index 最高）。

## 特性

- 自动 hide/show TabBar（避免被遮挡）
- 支持图片、订阅高亮按钮、底部链接
- Mask 点击触发确认
- 默认 confirm 文字「知道了」可改

## Props

```ts
interface AppNoticeModalProps {
  visible: boolean
  title: string
  content: string
  imageUrl?: string
  footerText?: string  // 带链接的底部说明
  highlightSubscribe?: boolean  // 高亮底部「去订阅」
  confirmText?: string  // 默认「知道了」
  onConfirm: () => void
}
```

## 用法

```tsx
<AppNoticeModal
  visible={showModal}
  title="新版本发布"
  content="新增 v2.3 内容..."
  imageUrl="https://cdn.example.com/xxx.png"
  footerText="去订阅更新提醒"
  highlightSubscribe
  onConfirm={() => setShowModal(false)}
/>
```

## 适用场景

公告弹窗、功能引导、Beta 提示、活动横幅。一般配合 `GlobalNotice` 全局组件使用。

## 依赖

- `@tarojs/components` (RootPortal / View / Text / Image)
- `@tarojs/taro` (hideTabBar/showTabBar)
- SCSS：`./index.scss`
