# 订阅消息统一流程

订阅类功能（活动提醒、精灵更新、版本更新等）必须按以下流程：

```
1. UI 触发 (点击「订阅」)
       │
       ▼
2. requestSubscribePermission(templateId)  ← 必须先调！
       │ (弹出微信授权框)
       ▼
3. 用户在弹窗里勾选「允许」/「拒绝」
       │
       ▼  accept=true
4. POST /api/subscriptions  写后端订阅记录
       │
       ▼
5. UI 反馈订阅成功
```

## 硬约束

参考 `utils/subscribeMessage.ts` 的 README。**禁止**在页面里手写 `wx.requestSubscribeMessage`。

## 常见反模式（避坑）

```tsx
// ❌ 错误：直接写 wx.requestSubscribeMessage
wx.requestSubscribeMessage({ tmplIds: [id], success: () => { ... } })

// ❌ 错误：先走后端、没授权就写
await api.subscribe(id)  // 用户没授权就入库，下次通知收不到

// ❌ 错误：忽略授权失败
const ok = await requestSubscribePermission(id)
// 没判断 ok，后端可能写入但用户实际拒绝

// ✅ 正确
const ok = await requestSubscribePermission(id)
if (!ok) return
await api.subscribe(id)
```

## 多个 templateId

微信一次弹窗最多 3 个模板。如需订阅多个，分多次调用 `requestSubscribePermission`。
