import { View, Text } from '@tarojs/components'
import { TabBarLayout } from '@/layouts'
import './index.scss'
export default function DiscoverPage() {
  return <TabBarLayout><View className='discover'><Text className='discover__title'>发现</Text><Text className='discover__desc'>标准 TabBar 布局</Text></View></TabBarLayout>
}
