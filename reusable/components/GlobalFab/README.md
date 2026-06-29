# GlobalFab

全局浮动操作按钮（FAB）。常驻屏幕右下角，点击跳到反馈页。

## 特性

- 全站单例，挂在 Page 组件内
- 不依赖具体业务，target URL 通过 props 注入
- 用 CachedImage 保证图标秒开

## Props

无（写死图标和跳转目标，迁移时改 hardcode 的 URL）

## 用法

```tsx
import Page from '@/components/Page'
import GlobalFab from '@/components/GlobalFab'

<Page>
  ...页面内容...
  <GlobalFab />
</Page>
```

## 修改跳转目标

`index.tsx` 里改 `Taro.navigateTo({ url: ... })` 为目标路径。

## 依赖

- `CachedImage`（同目录或 `@/components/CachedImage`）
- `@tarojs/components`（View）
- `@tarojs/taro`（navigateTo）
- 资源图标：`assets/home-icons/tools/advice.png` 或替换
