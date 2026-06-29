import { ReactNode } from 'react'
import { View, Text, Input } from '@tarojs/components'
import Taro from '@tarojs/taro'
import './index.scss'
export default function HeaderTabBarLayout({ title, subtitle, showSearch = false, onSearch, rightAction, children, className = '' }: { title: string; subtitle?: string; showSearch?: boolean; onSearch?: (k: string) => void; rightAction?: ReactNode; children: ReactNode; className?: string }) {
  const sb = Taro.getSystemInfoSync().statusBarHeight || 20
  return <View className={`header-tabbar-layout ${className}`}>
    <View className='header-tabbar-layout__header' style={{ paddingTop: `${sb}px` }}>
      <View className='header-tabbar-layout__header-content'>
        <View className='header-tabbar-layout__title-area'>
          <Text className='header-tabbar-layout__title'>{title}</Text>
          {subtitle && <Text className='header-tabbar-layout__subtitle'>{subtitle}</Text>}
        </View>
        {rightAction && <View className='header-tabbar-layout__action'>{rightAction}</View>}
      </View>
      {showSearch && <View className='header-tabbar-layout__search'><Input className='header-tabbar-layout__search-input' type='text' placeholder='搜索...' confirmType='search' onConfirm={(e) => onSearch?.(e.detail.value)} /></View>}
    </View>
    <View className='header-tabbar-layout__body'>{children}</View>
  </View>
}
