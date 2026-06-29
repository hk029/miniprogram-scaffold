# 页面滚动 + 吸顶 TabBar + 触底加载

跨项目通用的小程序滚动模式。集中记录从 `experience.md` 提取的踩坑和最终方案。

---

## 核心问题

需要「顶部 Tab 栏固定 + 内容区独立滚动 + 触底加载」时，有两个互斥的实现路径：

| | 方案 A：原生页面滚动 | 方案 B：内部滚动容器 ⭐ |
|---|---|---|
| **布局** | 不限高，内容自然撑开 | `height: 100vh` + `flex: 1; overflow-y: auto` |
| **滚动触发** | `useReachBottom`（页面级 hook） | `<ScrollView>` 的 `onScrollToLower` |
| **Sticky 支持** | 需要 `position: fixed` 模拟 | `position: sticky; top: 0` 正常工作 |
| **iOS 弹性** | 有，fixed 元素跟着弹跳 | 无，滚动在容器内部 |
| **推荐度** | ❌ 不推荐 | ✅ **推荐**（蛋组页、图鉴等都用这个） |

**根因**：`position: sticky` 需要 `overflow: auto/scroll` 的祖先容器才能工作。原生页面滚动不提供这个容器，所以 sticky 失效。

---

## 推荐方案（方案 B）

### 布局

```scss
.page {
  display: flex;
  flex-direction: column;
  height: 100vh;

  &__header { flex-shrink: 0; }    // 头部固定高度，不被压缩
  &__sticky-bar { flex-shrink: 0; } // Tab 栏（吸顶用 sticky）
  &__content {                    // 内容区独立滚动
    flex: 1;
    overflow-y: auto;
  }
}
```

### 组件

```tsx
function ListPage() {
  const handleScrollToLower = () => { /* 触底加载更多 */ }
  return (
    <View className='page'>
      <View className='page__header'>...</View>
      <View className='page__sticky-bar'>...</View>
      <ScrollView
        className='page__content'
        scrollY
        onScrollToLower={handleScrollToLower}
        lowerThreshold={200}
      >
        {/* 列表内容 */}
      </ScrollView>
    </View>
  )
}
```

---

## 关键踩坑

### 1. `position: sticky` 在原生页面滚动下不生效

只能用 `position: fixed` 模拟，但 iOS 弹性滚动时 fixed 元素跟着弹跳，体验差。

**结论**：要 sticky 就走方案 B。

### 2. `useReachBottom` 只在页面级滚动触发

内部 `<ScrollView>` 滚动不会触发 `useReachBottom`。改用 `<ScrollView>` 的 `onScrollToLower`。

### 3. `<ScrollView>` 需要固定高度

`flex: 1` 在 flex 父容器中等效于固定高度（已计算好的像素值），可以直接用。不要写 `height: auto`。

### 4. ScrollView 内部 `grid` 布局可能失效

两列卡片不要用 `display: grid; grid-template-columns: 1fr 1fr`，改用 flex：

```scss
&__cards { display: flex; flex-wrap: wrap; gap: 8px; }
&__card { width: calc(50% - 4px); box-sizing: border-box; }
```

### 5. ScrollView re-render 时滚动位置重置

用 `scrollLeft` ref + `key` 维持稳定：

```tsx
const scrollLeftRef = useRef(0)
<ScrollView
  scrollLeft={scrollLeftRef.current}
  onScroll={(e) => { scrollLeftRef.current = e.detail.scrollLeft }}
  key={someStableKey}
>
```

### 6. `inline-flex` 不可靠

用 `align-items: flex-start` 在父容器对齐，子元素用 `display: flex`。

---

## WXSS 兼容性补充

- 不支持 `:nth-child()` → 用显式类名 `__second` 等
- 不支持 `calc()` 内嵌 `env()` / `constant()` → 用固定值或 JS 算 inline style
- 不支持 SVG → 图片用 PNG

---

## 简单场景（不需 sticky）

如果只是固定头部 + 触底加载，不需要吸顶 Tab 栏：

- 头部用 `flex-shrink: 0`（更可靠，比 fixed 好）
- 内容区还是 `flex: 1; overflow-y: auto`
- 触底用 `onScrollToLower`

---

## 反模式

```tsx
// ❌ 方案 A：原生滚动 + position: fixed
<View style={{ position: 'fixed', top: 0 }}>Tab</View>
<View>长内容...</View>
// 触底用 useReachBottom

// ❌ 用 grid 在 ScrollView 内做两列
&__cards { display: grid; grid-template-columns: 1fr 1fr; }
// 容易失效

// ❌ ScrollView 不设高度
<ScrollView scrollY>...</ScrollView>
// 无法滚动

// ❌ 手写 wx.requestSubscribeMessage（违反订阅统一规则）
wx.requestSubscribeMessage({...})
```

---

## 经验来源

`rocokingdom` 项目 `experience.md`：
- 「小程序滚动体系：Sticky 与滚动加载的冲突」
- 「小程序 ScrollView 内的两列布局」
- 「小程序布局陷阱」
- 「小程序 WXSS 兼容性」
