import { View, Text } from '@tarojs/components'
import { ReactNode } from 'react'
import './index.scss'

interface DetailCardProps {
  title?: string | ReactNode
  tag?: string
  children: ReactNode
}

export default function DetailCard({ title, tag, children }: DetailCardProps) {
  return (
    <View className='detail-card'>
      {title && (
        <View className='detail-card__title'>
          {typeof title === 'string' ? (
            <Text className='detail-card__title-text'>{title}</Text>
          ) : (
            <View className='detail-card__title-text'>{title}</View>
          )}
          {tag && <Text className='detail-card__title-tag'>{tag}</Text>}
        </View>
      )}
      <View className='detail-card__body'>
        {children}
      </View>
    </View>
  )
}
