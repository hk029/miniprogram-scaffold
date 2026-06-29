# API 响应格式

```json
{ "code": 0, "message": "success", "data": {}, "pagination": { "page": 1, "page_size": 20, "total": 100, "total_pages": 5 } }
```

- 成功 `code: 0`，业务错误 `code != 0`
- 分页放 `pagination`，不塞 `data`
- 401 前端拦截跳登录
