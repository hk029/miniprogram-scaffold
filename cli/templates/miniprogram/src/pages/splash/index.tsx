import { View, Text } from '@tarojs/components'
import Taro from '@tarojs/taro'
import { FullscreenLayout } from '@/layouts'
import './index.scss'
export default function SplashPage() {
  return <FullscreenLayout safeArea={false} className='splash'>
    <View className='splash__content'>
      <View className='splash__logo'><Text className='splash__logo-text'>MS</Text></View>
      <Text className='splash__title'>Mini Scaffold</Text>
      <Text className='splash__subtitle'>Taro + Go 小程序脚手架</Text>
      <View className='splash__btn' onClick={() => Taro.switchTab({ url: '/pages/home/index' })}><Text className='splash__btn-text'>进入</Text></View>
    </View>
    <View className='splash__footer'><Text className='splash__footer-text'>全屏沉浸式布局</Text></View>
  </FullscreenLayout>
}
