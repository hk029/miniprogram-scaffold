import Taro from '@tarojs/taro'
export async function requestSubscribePermission(templateId: string): Promise<boolean> {
  try {
    const res = await new Promise<Record<string, any>>(r => {
      // @ts-ignore
      if (typeof wx !== 'undefined' && wx.requestSubscribeMessage) { // @ts-ignore
        wx.requestSubscribeMessage({ tmplIds: [templateId], success: (s: any) => r(s), fail: (s: any) => r(s) }); return }
      r({ errMsg: 'requestSubscribeMessage:ok', [templateId]: 'accept', mock: true })
    })
    if (res.errMsg !== 'requestSubscribeMessage:ok') { Taro.showToast({ title: '订阅授权失败', icon: 'none' }); return false }
    if (res[templateId] !== 'accept') { Taro.showToast({ title: '未授权订阅消息', icon: 'none' }); return false }
    return true
  } catch { Taro.showToast({ title: '订阅授权失败', icon: 'none' }); return false }
}
