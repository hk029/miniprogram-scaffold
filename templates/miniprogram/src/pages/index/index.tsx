import { useState, useEffect } from 'react'
import { View, Text, Button } from '@tarojs/components'
import Taro from '@tarojs/taro'
import './index.scss'

interface HelloResponse {
  code: number
  message: string
  data: {
    greeting: string
    timestamp: string
  }
}

export default function Index() {
  const [message, setMessage] = useState<string>('')
  const [loading, setLoading] = useState<boolean>(false)
  const [error, setError] = useState<string>('')

  const fetchHello = async () => {
    setLoading(true)
    setError('')
    
    try {
      const response = await Taro.request({
        url: 'http://localhost:8080/api/hello',
        method: 'GET',
        header: {
          'Content-Type': 'application/json'
        }
      })
      
      const data = response.data as HelloResponse
      
      if (data.code === 200) {
        setMessage(data.data.greeting)
      } else {
        setError(data.message || '请求失败')
      }
    } catch (err) {
      setError('网络错误，请检查后端服务是否启动')
      console.error('Request failed:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    // Auto-fetch on component mount
    fetchHello()
  }, [])

  return (
    <View className='index'>
      <View className='header'>
        <Text className='title'>Taro + Go 小程序脚手架</Text>
        <Text className='subtitle'>最简 MVP 示例</Text>
      </View>
      
      <View className='content'>
        <View className='card'>
          <Text className='card-title'>Hello World 接口测试</Text>
          
          {loading ? (
            <Text className='loading'>加载中...</Text>
          ) : error ? (
            <View className='error'>
              <Text className='error-text'>{error}</Text>
              <Button 
                className='retry-btn' 
                onClick={fetchHello}
              >
                重试
              </Button>
            </View>
          ) : (
            <View className='success'>
              <Text className='message'>{message || '暂无数据'}</Text>
            </View>
          )}
        </View>
        
        <View className='actions'>
          <Button 
            className='action-btn primary' 
            onClick={fetchHello}
            loading={loading}
          >
            刷新数据
          </Button>
          
          <Button 
            className='action-btn secondary' 
            onClick={() => {
              Taro.showToast({
                title: '功能开发中...',
                icon: 'none'
              })
            }}
          >
            更多功能
          </Button>
        </View>
      </View>
      
      <View className='footer'>
        <Text className='footer-text'>
          基于 Taro 3 + Go Fiber 构建
        </Text>
      </View>
    </View>
  )
}