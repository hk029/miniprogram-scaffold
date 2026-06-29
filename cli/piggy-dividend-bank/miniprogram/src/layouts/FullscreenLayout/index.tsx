import { ReactNode } from 'react'
import { View } from '@tarojs/components'
import './index.scss'
export default function FullscreenLayout({ children, className = '', safeArea = true }: { children: ReactNode; className?: string; safeArea?: boolean }) {
  return <View className={`fullscreen-layout ${safeArea ? 'fullscreen-layout--safe' : ''} ${className}`}>{children}</View>
}
