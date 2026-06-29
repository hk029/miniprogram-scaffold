# obfuscate.ts

Base64 + JSON 编解码工具，附带简单的「混淆」前缀（`RAW` / `e`）。

## 导出

```ts
utf8ToBase64(str)           // UTF-8 字符串 → Base64
base64ToUtf8(str)           // Base64 → UTF-8 字符串
obfuscate(obj)              // JSON → 'RAW' + 反转 + 替换 base64
deobfuscate(raw)            // 'RAW' 解码回 JSON
tryDeobfuscate(raw)         // 自动识别 'e' 或 'RAW' 格式
```

## 适用场景

- 响应拦截器里调用 `tryDeobfuscate`，兼容后端可能的混淆格式
- URL 参数 / 本地存储里塞 JSON 时用 `obfuscate` 编码

## 实现细节

- 纯 JS 实现的 Base64（不需要 `btoa` / `atob`），H5/小程序通用
- `obfuscate` 不加密，只是改字符序让肉眼无法识别
- `tryDeobfuscate` 是响应拦截的兜底：能解就解，解不了原样返回

## 迁移

直接搬。零依赖。
