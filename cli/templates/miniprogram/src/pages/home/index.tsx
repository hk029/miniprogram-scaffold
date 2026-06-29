import { useState, useEffect } from 'react'
import { View, Text, Button } from '@tarojs/components'
import Taro from '@tarojs/taro'
import { HeaderTabBarLayout } from '@/layouts'
import './index.scss'
export default function HomePage() {
  const [g, setG] = useState(''), [loading, setLoading] = useState(false)
  const fetch = async () => { setLoading(true); try { const r = await Taro.request({ url: 'http://localhost:8080/api/hello' }); const d = r.data as any; if (d.code === 0) setG(d.data.greeting) } catch { Taro.showToast({ title: '网络错误', icon: 'none' }) } finally { setLoading(false) } }
  useEffect(() => { fetch() }, [])
  return <HeaderTabBarLayout title='首页' subtitle='Taro + Go 脚手架' showSearch onSearch={(k) => Taro.showToast({ title: `搜索: ${k}`, icon: 'none' })}>
    <View className='home'><View className='home__card'>
      <Text className='home__card-title'>Hello World</Text>
      <Text className='home__card-body'>{loading ? '加载中...' : g || '暂无数据'}</Text>
      <Button className='home__btn' onClick={fetch} loading={loading}>刷新</Button>
    </View></View>
  </HeaderTabBarLayout>
}
