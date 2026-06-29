# Page

页面容器壳。统一页面背景、底部安全区、全局挂件（GlobalFab / GlobalNotice 等）。

## 用法

```tsx
import Page from '@/components/Page'
import GlobalFab from '@/components/GlobalFab'
import GlobalNotice from '@/components/GlobalNotice'

export default function MyPage() {
  return (
    <Page>
      <View>页面内容</View>
      <GlobalFab />
      <GlobalNotice />
    </Page>
  )
}
```

## 必放内容

每个页面根用 `<Page>` 包，里头带 `<GlobalFab />` 等全局挂件。SCSS 统一了底部安全区，状态栏适配。

## 迁移

如果不需要全局 FAB，删除对应行即可。Page 本身只承担容器职责，没有 state 副作用。
