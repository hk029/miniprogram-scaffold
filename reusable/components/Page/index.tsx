import { ReactNode } from 'react'
import { View } from '@tarojs/components'
import CachedImage from '../CachedImage'
import GlobalShareCapsule from '../GlobalShareCapsule'
import defaultPageBg from '../../assets/backgrounds/home-hero-bg.jpg'
import './index.scss'

export const DEFAULT_PAGE_BG = defaultPageBg

interface PageProps {
  header?: ReactNode
  overlay?: ReactNode
  children: ReactNode
  className?: string
  headerClassName?: string
  contentClassName?: string
  background?: string
}

export default function Page({
  header,
  overlay,
  children,
  className = '',
  headerClassName = '',
  contentClassName = '',
  background = DEFAULT_PAGE_BG,
}: PageProps) {
  return (
    <View className={`page ${className}`}>
      <GlobalShareCapsule />
      <CachedImage className='page__bg' src={background} mode='aspectFill' />
      <View className='page__fade' />
      {header && <View className={`page__header ${headerClassName}`}>{header}</View>}
      <View className={`page__body ${contentClassName}`}>{children}</View>
      {overlay && <View className='page__overlay'>{overlay}</View>}
    </View>
  )
}
