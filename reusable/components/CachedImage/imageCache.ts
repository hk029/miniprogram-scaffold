import Taro from '@tarojs/taro'
const FS = Taro.getFileSystemManager()
const CACHE_DIR = 'image_cache'
const getCacheDir = () => `${Taro.env.USER_DATA_PATH}/${CACHE_DIR}`

async function ensureCacheDir() {
  return new Promise<void>(r => FS.mkdir({ dirPath: getCacheDir(), recursive: true, success: () => r(), fail: () => r() }))
}

export function isRemoteUrl(url: string) { return url.startsWith('http://') || url.startsWith('https://') }

function getLocalPath(url: string) {
  let h = 5381; for (let i = 0; i < url.length; i++) { h = ((h << 5) + h) + url.charCodeAt(i); h = h & h }
  const ext = url.match(/\.[^.]+$/)?.[0]?.toLowerCase() || '.png'
  return `${getCacheDir()}/${Math.abs(h).toString(16).padStart(8, '0')}${ext}`
}

async function fileExists(p: string) { return new Promise<boolean>(r => FS.access({ path: p, success: () => r(true), fail: () => r(false) })) }

async function downloadAndCache(url: string) {
  await ensureCacheDir(); const lp = getLocalPath(url)
  const res = await Taro.request<ArrayBuffer>({ url, responseType: 'arraybuffer' })
  if (!res.data) throw new Error('empty')
  await new Promise<void>((ok, no) => FS.writeFile({ filePath: lp, data: res.data as unknown as string, encoding: 'binary', success: () => ok(), fail: e => no(e) }))
  return lp
}

export async function downloadIfNeeded(url: string) {
  if (!isRemoteUrl(url)) return url
  const lp = getLocalPath(url)
  if (await fileExists(lp)) return lp
  try { return await downloadAndCache(url) } catch { return url }
}
