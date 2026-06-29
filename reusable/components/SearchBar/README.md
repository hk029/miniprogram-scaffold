# SearchBar

统一搜索输入条。带 debounce、清空按钮、可配 placeholder。

## 用法

```tsx
<SearchBar
  value={query}
  onChange={setQuery}
  placeholder="搜索精灵..."
  debounceMs={300}
/>
```

## Props

按需查阅 `index.tsx`。

## 迁移

无业务依赖。debounce 用法可改成 lodash / 自实现。
