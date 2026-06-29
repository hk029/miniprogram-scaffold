# iOS Date.parse 兼容性

## 症状

```ts
Date.parse('2026-05-15 09:17:54')  // NaN on iOS Safari
Date.parse('2026-05-15T09:17:54Z')  // ✅ 正常
```

iOS Safari（以及微信内置 WebView）严格按 RFC3339 要求，**日期和时间的分隔符必须是 `T`**，空格不接受。

## 解决

发送前把空格替换成 `T`：

```ts
function safeParseDate(s: string): number {
  return Date.parse(s.replace(' ', 'T'))
}
```

或后端统一返回 ISO8601 格式（`T` 分隔）。前端展示时再用 `formatDate` 转回空格。

## 常见来源

- MySQL `DATETIME` 转 JSON 默认是 `'2026-05-15 09:17:54'`（空格）
- Go `time.Time` 默认 `MarshalJSON` 输出 ISO8601（`T`）
- SQLite `datetime()` 函数返回空格分隔

## 通用规则

跨端 JS 代码里，**始终用 ISO8601 字符串**（`T` 分隔 + `Z` 或 `±HH:MM` 时区）作为日期传输格式。前端 `new Date()` 容忍两种，但 `Date.parse()` 只认严格格式。

展示给用户前再 `formatDate` 转成易读形式（`YYYY-MM-DD HH:mm`）。
