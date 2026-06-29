import { View } from '@tarojs/components'
import Taro from '@tarojs/taro'
import './index.scss'
import CachedImage from '../CachedImage'
import adviceIcon from '../../assets/home-icons/tools/advice.png'

export default function GlobalFab() {
  const handleClick = () => {
    const pages = Taro.getCurrentPages()
    const currentPage = pages[pages.length - 1]
    const path = currentPage?.route || ''
    Taro.navigateTo({ url: `/pages/feedback/index?openModal=1&from=${encodeURIComponent(path)}` })
  }

  return (
    <View className='global-fab' onClick={handleClick}>
      <CachedImage
        className='global-fab-icon'
        src={adviceIcon}
        mode='aspectFit'
      />
    </View>
  )
}
