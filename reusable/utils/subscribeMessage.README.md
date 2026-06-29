# requestSubscribePermission（subscribeMessage.ts）

微信小程序订阅消息统一调用封装。

## 规则（来自项目 CLAUDE.md 硬约束）

> 所有订阅类功能（活动、精灵、版本更新等）必须先调用统一方法 `requestSubscribePermission(templateId)`（`miniprogram/src/utils/subscribeMessage.ts`）拉起微信订阅弹窗，授权通过后再写入后端订阅记录；禁止在页面里重复手写 `wx.requestSubscribeMessage`。

## 用法

```ts
import { requestSubscribePermission } from '@/utils/subscribeMessage'

const ok = await requestSubscribePermission('TEMPLATE_ID_HERE')
if (!ok) return  // 用户拒绝或失败
// 再调后端订阅接口写库
```

## 返回

`Promise<boolean>` — true 表示用户点了「允许」。

## 实现细节

- 包了 `wx.requestSubscribeMessage`，做 Promise 化
- 检查 `errMsg` 和模板 ID 的 `accept` 字段
- 非小程序环境（H5 / 开发 mock）默认放行 true，不阻塞流程
- 失败 / 拒权会 `Taro.showToast` 提示

## 迁移到其他项目

1. 复制本文件
2. 替换 `@tarojs/taro` 为项目实际依赖
3. 所有订阅入口（活动页、精灵详情等）改用这个工具，不要手写 `wx.requestSubscribeMessage`
