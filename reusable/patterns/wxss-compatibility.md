# WXSS 兼容性

微信小程序的 WXSS 不完全等同标准 CSS。以下写法**不支持**，必须绕开。

## 不支持 `:nth-child()`

```scss
// ❌
& > :nth-child(2) { margin-left: -25px; }

// ✅ 用显式类名
&__second { margin-left: -25px; }
```

> 整个 `experience.md` 反复出现这个坑，凡是"想选第 N 个子元素"的地方都要 BEM 类名顶上。

## 不支持 `calc()` 内嵌 `env()` / `constant()`

```scss
// ❌
padding-bottom: calc(20px + env(safe-area-inset-bottom));

// ✅ 固定值
padding-bottom: 40px;

// ✅ 或者 JS 算
const bottom = Taro.getSystemInfoSync().safeArea?.bottom
<View style={{ paddingBottom: bottom ? `${bottom}px` : '20px' }} />
```

## 不支持 SVG

```tsx
// ❌
<Image src="data:image/svg+xml;..." />

// ✅ 用 PNG
<Image src="/assets/icon.png" />
```

Light 变体（`_light.png`）用于彩色背景，白底透明（`_nobg.png`）用于圆形背景。

## 其他已知差异

- `position: sticky` 需要 `overflow: auto/scroll` 祖先（见 `page-scroll-and-tabbar.md`）
- `inline-flex` 不可靠（用 flex + align-items）
- `:has()` 不支持
- 一些 CSS 变量在 `calc` 里行为不一致

## 怎么验证

Code review 时看到这些写法直接打回。如果新发现的兼容性坑，加到这个文档。
