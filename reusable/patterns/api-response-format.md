# API 响应格式

所有后端接口（`/api/*`）统一返回：

```ts
{
  code: number         // 0 = 成功，非 0 = 业务错误码
  message: string      // 中文错误描述 / 成功消息
  data: any            // 业务 payload
  pagination?: {       // 仅分页接口
    page: number
    page_size: number
    total: number
    total_pages: number
  }
}
```

## 前端封装

`apiRequest` 等统一拦截器：
- `code === 0` → resolve(`response.data`)
- `code !== 0` → reject(new Error(response.message))，由调用方 catch
- 401 → 跳转登录

## 关键约定

- 后端成功永远 `code: 0`，不要用 HTTP 200 + 自定义 error code
- 业务报错也用 `code != 0` + `message` 描述，避免混用 HTTP status
- 分页字段固定放在 `pagination`，不要塞进 `data`

## 示例

```json
{
  "code": 0,
  "message": "success",
  "data": {
    "id": 1,
    "title": "测试活动"
  },
  "pagination": {
    "page": 1,
    "page_size": 20,
    "total": 123,
    "total_pages": 7
  }
}
```
