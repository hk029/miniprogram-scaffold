import { Image, View } from '@tarojs/components'
import { useState, useEffect, memo } from 'react'
import { downloadIfNeeded, isRemoteUrl } from './imageCache'
import './index.scss'

function CachedImage({ src, mode, lazyLoad = false, className = '', style, onClick }: any) {
  const [displaySrc, setDisplaySrc] = useState('')
  const [ready, setReady] = useState(false)
  useEffect(() => {
    const s = src || ''
    if (!s) { setDisplaySrc(''); setReady(false); return }
    if (!isRemoteUrl(s)) { setDisplaySrc(s); setReady(true); return }
    setDisplaySrc(''); setReady(false)
    let c = false; ;(async () => { const l = await downloadIfNeeded(s); if (!c) { setDisplaySrc(l); setReady(true) } })()
    return () => { c = true }
  }, [src])
  return <View className={`cached-image ${ready ? 'cached-image--ready' : ''} ${className}`} style={style} onClick={onClick}>
    {displaySrc ? <Image className='cached-image__img' src={displaySrc} mode={mode} lazyLoad={lazyLoad} /> : <View className='cached-image__placeholder' />}
  </View>
}
export default memo(CachedImage)
