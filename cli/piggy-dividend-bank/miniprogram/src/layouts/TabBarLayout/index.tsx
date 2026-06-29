import { ReactNode } from 'react'
import { View } from '@tarojs/components'
import './index.scss'
export default function TabBarLayout({ children, className = '' }: { children: ReactNode; className?: string }) {
  return <View className={`tabbar-layout ${className}`}>{children}</View>
}
