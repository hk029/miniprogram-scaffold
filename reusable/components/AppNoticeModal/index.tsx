import { RootPortal, View, Text, Image } from '@tarojs/components'
import Taro from '@tarojs/taro'
import { useEffect } from 'react'
import './index.scss'

interface AppNoticeModalProps {
  visible: boolean
  title: string
  content: string
  imageUrl?: string
  footerText?: string
  highlightSubscribe?: boolean
  confirmText?: string
  onConfirm: () => void
}

export default function AppNoticeModal({
  visible,
  title,
  content,
  imageUrl,
  footerText,
  highlightSubscribe = false,
  confirmText = '知道了',
  onConfirm,
}: AppNoticeModalProps) {
  useEffect(() => {
    if (!visible) return

    Taro.hideTabBar({ animation: false }).catch(() => {})
    return () => {
      Taro.showTabBar({ animation: false }).catch(() => {})
    }
  }, [visible])

  if (!visible) return null

  return (
    <RootPortal>
      <View className='app-notice-modal'>
        <View className='app-notice-modal__mask' onClick={onConfirm} />
        <View className='app-notice-modal__content'>
          <Text className='app-notice-modal__title'>{title}</Text>
          <Text className='app-notice-modal__text'>{content}</Text>
          {imageUrl && (
            <View className='app-notice-modal__image-wrap'>
              <Image className='app-notice-modal__image' src={imageUrl} mode='widthFix' />
            </View>
          )}
          {footerText && highlightSubscribe ? (
            <Text className='app-notice-modal__footer'>
              更多详情可以点击【开发进度】查看，现已支持
              <Text className='app-notice-modal__footer-highlight'>订阅</Text>
              开发中的功能，当功能上线会第一时间通知您
            </Text>
          ) : (
            footerText && <Text className='app-notice-modal__footer'>{footerText}</Text>
          )}
          <View className='app-notice-modal__btn' onClick={onConfirm}>
            <Text className='app-notice-modal__btn-text'>{confirmText}</Text>
          </View>
        </View>
      </View>
    </RootPortal>
  )
}
