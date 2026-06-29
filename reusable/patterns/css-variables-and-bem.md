# CSS 变量体系（字号 / 颜色）

项目用 SCSS + CSS 变量统一字号，禁止写死 px。

## 字号变量（`app.scss`）

```scss
:root {
  --fs-xxs: 18rpx;   /* 最小标签 */
  --fs-xs:  22rpx;
  --fs-sm:  24rpx;
  --fs-base: 28rpx;  /* 通用正文 */
  --fs-lg:  32rpx;
  --fs-xl:  36rpx;
  --fs-xxl: 40rpx;   /* 大标题 */
  --fs-display: 48rpx;
  --fs-hero:    64rpx;
}
```

## 用法

```scss
.title {
  font-size: var(--fs-xl);
  font-weight: 700;
}
```

## 硬约束（CLAUDE.md）

> **CSS 字号变量**：所有文本字号必须使用 `app.scss` 定义的 CSS 变量（`--fs-xxs` / `--fs-xs` / ...），**禁止写死 px 值**。

## 为什么用 rpx

微信小程序的 rpx 是自适应单位（750rpx = 屏幕宽度）。换不同设备不用改字体。

## 颜色

参照项目 `app.scss` 里的 `--color-primary`（`#4FC0FF`）和其他变量。其他新色优先用变量，必要时扩 SCSS 变量。

## CSS 类命名

遵循 **BEM**：`.block__element--modifier`，例：

```scss
.activity-card {
  /* block */
}
.activity-card__title {
  /* element */
}
.activity-card__title--highlighted {
  /* modifier */
}
```
