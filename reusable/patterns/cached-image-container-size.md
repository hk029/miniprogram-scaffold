# CachedImage 容器尺寸规则

使用项目自带的 `<CachedImage>`（或普通 `<Image>`）时，**必须**给父容器显式 `width` 和 `height`，否则图片不渲染或 layout 跳动。

## 原因

Taro / 小程序的 `<Image>` 在没有明确尺寸的容器里，会因为无法计算布局导致不渲染（一个常见坑）。

## 反例

```scss
/* ❌ 没有尺寸 */
.icon {
  /* 这里只有 padding */
}
```

```tsx
<View className="icon">
  <CachedImage src="..." />
</View>
```

## 正例

```scss
/* ✅ 显式 size */
.icon {
  width: 48px;
  height: 48px;
  border-radius: 8px;
}
```

## 项目 CLAUDE.md 中的硬规则

> Remote images: use `CachedImage`; the parent container must have explicit width and height. See `experience.md`.

## 检测

Code review 时看到这个 pattern 直接打回。
