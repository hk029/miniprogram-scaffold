# AnnouncementModal

系统公告展示。一般由 `useAnnouncements` hook 拉 `/api/announcements` 后传给本组件。

## 用法

```tsx
import { AnnouncementModal } from '@/components/AnnouncementModal'

<AnnouncementModal
  data={announcements}
  onClose={() => setOpen(false)}
/>
```

数据格式按 `announcements.json`（title/content/createdAt 等）。

## 迁移

只要后端返回结构相同（title/content/url/created_at 等字段）即可直接搬。
