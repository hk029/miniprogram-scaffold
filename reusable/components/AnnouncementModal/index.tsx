import Taro, { useDidShow } from '@tarojs/taro'
import { useState } from 'react'
import { fetchAnnouncements, Announcement } from '../../services/api'
import AppNoticeModal from '../AppNoticeModal'

const STORAGE_KEY = 'announcements_dismissed'

const TYPE_ICON: Record<string, string> = {
  update: '🆕',
  notice: '📢',
  maintenance: '🔧',
}

const UPDATE_FOOTER_TEXT = '更多详情可以点击【开发进度】查看，现已支持订阅开发中的功能，当功能上线会第一时间通知您'
const UPDATE_IMAGE_URL = 'https://img.hksite.cn/rocokingdom/assets/upgrade_v3.jpg?v=1'

async function getDismissed(): Promise<string[]> {
  try {
    const val = await Taro.getStorage({ key: STORAGE_KEY })
    return val.data ? JSON.parse(val.data) : []
  } catch {
    return []
  }
}

async function dismiss(id: string, showOnce: boolean): Promise<void> {
  if (!showOnce) return
  try {
    const dismissed = await getDismissed()
    if (!dismissed.includes(id)) {
      dismissed.push(id)
      await Taro.setStorage({ key: STORAGE_KEY, data: JSON.stringify(dismissed) })
    }
  } catch { /* ignore */ }
}

async function loadAnnouncement(): Promise<Announcement | null> {
  let announcements: Announcement[] = []
  try {
    const res = await fetchAnnouncements()
    if (res.code === 0 && Array.isArray(res.data)) {
      announcements = res.data
    }
  } catch {
    return null
  }

  if (announcements.length === 0) {
    return null
  }

  // 按 priority 排序，取最高优先级的
  announcements.sort((a, b) => a.priority - b.priority)
  const top = announcements[0]

  // 检查是否已忽略
  const dismissed = await getDismissed()
  if (dismissed.includes(top.id)) {
    return null
  }

  return top
}

export default function AnnouncementModal() {
  const [announcement, setAnnouncement] = useState<Announcement | null>(null)

  const checkAnnouncement = () => {
    loadAnnouncement().then(setAnnouncement)
  }

  useDidShow(() => {
    checkAnnouncement()
  })

  const handleConfirm = async () => {
    if (!announcement) return
    await dismiss(announcement.id, announcement.showOnce)
    setAnnouncement(null)
  }

  const icon = announcement ? (TYPE_ICON[announcement.type] || '📢') : ''

  return (
    <AppNoticeModal
      visible={!!announcement}
      title={announcement ? `${icon} ${announcement.title}` : ''}
      content={announcement?.content || ''}
      imageUrl={announcement?.type === 'update' ? UPDATE_IMAGE_URL : undefined}
      footerText={announcement?.type === 'update' ? UPDATE_FOOTER_TEXT : undefined}
      highlightSubscribe={announcement?.type === 'update'}
      onConfirm={handleConfirm}
    />
  )
}
