import Taro from '@tarojs/taro'
import { ReactNode } from 'react'
import { View, Text } from '@tarojs/components'
import './index.scss'

interface PageHeaderProps {
  title: string
  description?: string
  visual?: ReactNode
  visualImage?: string
  paddingTop?: number
  className?: string
  showBack?: boolean
}

export default function PageHeader({
  title,
  description,
  paddingTop = 52,
  className = '',
  showBack = false,
}: PageHeaderProps) {
  return (
    <View className={`page-header ${className}`} style={{ paddingTop: `${paddingTop}px` }}>
      <View className='page-header__content'>
        <View className='page-header__back-wrap'>
          {showBack && (
            <View className='page-header__back' onClick={() => {
              const pages = Taro.getCurrentPages()
              if (pages.length > 1) {
                Taro.navigateBack()
              } else {
                Taro.reLaunch({ url: '/pages/home/index' })
              }
            }}>
              <Text className='page-header__back-text'>‹</Text>
            </View>
          )}
          <View className='page-header__copy'>
            <Text className='page-header__title'>{title}</Text>
            {description && <Text className='page-header__description'>{description}</Text>}
          </View>
        </View>
      </View>
    </View>
  )
}
