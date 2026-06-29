# Confetti

撒花 / 礼花特效。达成、签到、抽奖等场景用。

## 用法

```tsx
import Confetti from '@/components/Confetti'

const [show, setShow] = useState(false)

<Confetti visible={show} onDone={() => setShow(false)} />
```

## Props

按需查阅 `index.tsx`。

## 迁移

纯展示组件，无业务依赖。直接搬过去即可，CSS 动画按目标项目调整时长即可。
