# 小程序包体积优化

主包超过 1.5MB 限制时需要从多个角度瘦身。以下是 `rocokingdom` 项目验证过的组合方案。

## 三大手段

1. **分包** — `subPackages` 把不常用页移到子包
2. **Terser 压缩** — JS minify
3. **按需注入** — `lazyCodeLoading: 'requiredComponents'`

---

## 1. 分包策略

在 `app.config.ts`：

```ts
export default {
  pages: [
    'pages/pokedex/index',
    'pages/home/index',
    // 主包：核心 Tab 页
  ],
  subPackages: [
    { root: 'pages/pet-detail', pages: ['index'] },
    { root: 'pages/skill-detail', pages: ['index'] },
    // 子包：详情页等
  ],
  lazyCodeLoading: 'requiredComponents',
  componentFramework: 'glass-easel',
}
```

**划分原则**：
- 主包：Tab 页（pokedex / home / breeding / battle / tools）
- 子包：详情页、长尾工具页、运营页

**项目实测**（`rocokingdom`）：分包前主包 1.8MB → 分包后 1.1MB。

## 2. JS 压缩

`config/index.ts`：

```ts
mini: {
  webpackChain: (chain) => {
    chain.merge({
      plugin: {
        terser: {
          plugin: require('terser-webpack-plugin'),
          args: [{
            terserOptions: {
              compress: true,
              keep_classnames: true,
              keep_fnames: true,
            },
          }],
        },
      },
    })
  },
}
```

`project.config.json`：

```json
{
  "minified": true,
  "uglifyFileName": true,
  "lazyCodeLoading": "requiredComponents"
}
```

## 3. 按需注入

`lazyCodeLoading: 'requiredComponents'` 让 Taro 只注入实际用到的组件，未引用的不进主包。

需要 `componentFramework: 'glass-easel'`（Taro 4 默认）配合。

## 4. 进一步压缩（按需）

- **图片资源**：用 WebP、CDN + 远程图。资源不进包，直接走 `https://cdn.example.com/...`。
- **图表库/动效库**：能放子包就别放主包。
- **重复依赖**：用 `npm dedupe` 或 `pnpm` 强制扁平化。

## 验证

```bash
# 编译后看产物
du -sh dist/*
ls -la dist/static/js/
```

`dist/` 整体 + 主包 `app.js` 大小是核心指标。微信开发者工具上传时也会提示主包超 1.5MB。
