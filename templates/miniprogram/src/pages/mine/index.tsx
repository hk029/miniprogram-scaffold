import { View, Text } from '@tarojs/components'
import { TabBarLayout } from '@/layouts'
import './index.scss'
export default function MinePage() {
  return <TabBarLayout><View className='mine'><Text className='mine__title'>我的</Text><Text className='mine__desc'>个人中心</Text></View></TabBarLayout>
}
