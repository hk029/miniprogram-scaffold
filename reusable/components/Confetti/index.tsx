import { View } from '@tarojs/components'
import './index.scss'

// 纯 CSS confetti 动画组件
// 生成多个彩色纸片从顶部飘落的效果
const COLORS = ['#FFD700', '#FF6B6B', '#4FC0FF', '#22C55E', '#A855F7', '#FF8C42', '#FF69B4']
const COUNT = 30

function randomBetween(min: number, max: number) {
  return Math.random() * (max - min) + min
}

export default function Confetti() {
  const pieces = Array.from({ length: COUNT }, (_, i) => {
    const color = COLORS[i % COLORS.length]
    const left = randomBetween(0, 100)
    const delay = randomBetween(0, 0.8)
    const duration = randomBetween(1.5, 3)
    const size = randomBetween(8, 16)
    const rotation = randomBetween(0, 360)
    const drift = randomBetween(-30, 30)

    return (
      <View
        key={i}
        className='confetti__piece'
        style={{
          left: `${left}%`,
          width: `${size}px`,
          height: `${size * 0.6}px`,
          backgroundColor: color,
          animationDelay: `${delay}s`,
          animationDuration: `${duration}s`,
          transform: `rotate(${rotation}deg)`,
          '--drift': `${drift}px`,
        } as any}
      />
    )
  })

  return (
    <View className='confetti'>
      {pieces}
    </View>
  )
}
