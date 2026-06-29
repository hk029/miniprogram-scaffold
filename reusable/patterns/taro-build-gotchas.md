# Taro 构建踩坑

## `@/` alias 解析失败：dist 残留旧模块引用

### 症状

`import x from '@/utils/y'` 编译后报 `Module not found` 或 `Cannot resolve '@/...'`。

### 原因

`dist/` 目录残留旧版本（dev 时增量编译，cache 没清）。新版本改了 `tsconfig.json` paths 或 `config/index.ts` 的 alias，cache 里还是旧路径。

### 解决

```bash
rm -rf dist .taro-cache node_modules/.cache
npm run dev:weapp
```

构建前清掉 dist + taro cache + webpack cache 三个目录。

### 防止再发

`package.json` 加 npm script：

```json
{
  "scripts": {
    "dev:weapp:clean": "rm -rf dist .taro-cache && taro build --type weapp --watch",
    "build:weapp:clean": "rm -rf dist .taro-cache && NODE_ENV=production taro build --type weapp"
  }
}
```

alias 改了优先跑 `:clean` 版本。

---

## mini-css-extract-plugin Conflicting order 警告

### 症状

编译时大量 `Conflicting order warning: ...` 警告，不影响运行但刷屏。

### 原因

多个 SCSS 文件 import 顺序不一致，导致 CSS chunk 合并时顺序冲突。

### 解决

`config/index.ts` 加：

```ts
mini: {
  cssLoaderOption: {
    modules: {
      // 不开 modules（项目用 BEM 而不是 CSS Modules）
    },
  },
}
```

或 webpack chain 关掉 `optimize-css-assets-webpack-plugin` 的顺序检查（不推荐）。

更彻底的修复：统一所有 SCSS import 顺序，按字母排：

```scss
// 在入口 scss 里
@import './variables';
@import './reset';
@import './components/button';
@import './components/card';
```

## Go 工具链版本不匹配

`go.mod` 升级后构建报 `golang.org/x/sys requires go 1.25+`：

```dockerfile
FROM golang:1.23-alpine
ENV GOTOOLCHAIN=auto
```

`GOTOOLCHAIN=auto` 让 Go 1.23 自动下载所需版本工具链，不用每次升级基础镜像。

---

## 调试时记得

- `process.env.NODE_ENV` 切换 API 环境（在构建脚本里注入）
- `npm run dev:weapp` 启动后改代码自动热更新（无需手动刷开发者工具）
- 真机调试需要勾选「不校验合法域名」（开发期间）
