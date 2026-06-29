# 设计系统

## CSS 变量（推荐）

```scss
:root {
  --fs-xxs: 18rpx; --fs-xs: 22rpx; --fs-sm: 24rpx; --fs-base: 28rpx;
  --fs-lg: 32rpx; --fs-xl: 36rpx; --fs-xxl: 40rpx;
  --fs-display: 48rpx; --fs-hero: 64rpx;
}
```

## 颜色

| 变量 | 值 | 用途 |
|------|-----|------|
| `$primary-color` | `#1890ff` | 主色调 |
| `$success-color` | `#52c41a` | 成功 |
| `$warning-color` | `#faad14` | 警告 |
| `$error-color` | `#f5222d` | 错误 |
| `$text-color` | `#333333` | 正文 |
| `$bg-color` | `#f5f5f5` | 背景 |

## 间距 / 圆角 / 阴影

见 `src/styles/variables.scss`。
