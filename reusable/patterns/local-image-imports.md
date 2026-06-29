# 本地图片引用约定

Taro/Webpack 项目里引用 `src/assets/` 下 PNG/JPG 的统一做法。

## 1. 目录组织

```
src/assets/
├── backgrounds/      # 页面背景图
├── home-icons/       # 首页图标
│   ├── core/         # 核心功能（podex/skill/...）
│   └── tools/        # 工具类（advice/design/...）
├── icons/common/     # 通用图标（filter/egg/level/...）
├── elements/
│   ├── plain/        # 彩色元素图标
│   └── nobg/         # 白底透明元素图标
├── tab/              # TabBar 图标
│   ├── main/
│   └── extra/
├── items/            # 道具图标（CDN 优先，本地备用）
└── activity-icons/   # 活动专用
```

按用途分类，不堆在一个目录。

## 2. ES Module 导入

```tsx
import iconPodex from '../assets/home-icons/core/podex.png'

<Image src={iconPodex} mode="aspectFit" className="tab-icon" />
```

Webpack/Taro 编译时把 PNG 当静态资源打包，import 返回最终 URL 字符串。

**绝对路径**不要写（`<Image src="/assets/xxx.png" />` 在小程序里不会自动解析）。

## 3. 集中常量文件（推荐）

`src/constants/pageIcons.ts`：

```ts
import iconPodex from '../assets/home-icons/core/podex.png'
import iconSkill from '../assets/home-icons/core/skill.png'
import iconTool from '../assets/home-icons/core/tool.png'

export const PAGE_ICONS = {
  petDex: iconPodex,
  skillDex: iconSkill,
  tools: iconTool,
}
```

页面里：

```tsx
import { PAGE_ICONS } from '@/constants/pageIcons'

<Image src={PAGE_ICONS.petDex} mode="aspectFit" />
```

**好处**：
- 改图标只动一处
- 跨页复用统一引用
- 重命名图标属性可加类型保护

## 4. Light/Nobg 双版本（重要）

很多图标需要两个版本：

- `xxx.png` — 浅色背景用
- `xxx_light.png` — 深色 / 彩色背景用
- `xxx_nobg.png` — 透明背景（套圆形容器）

调用时根据 context 切换：

```tsx
<Image
  src={isDarkBg ? iconFilter_light : iconFilter}
  mode="aspectFit"
/>
```

## 5. 何时用本地 vs 远程

| 场景 | 推荐 | 原因 |
|---|---|---|
| App 图标 / TabBar / 启动图 | **本地** | 启动快、离线可用 |
| 全局 UI 控件（搜索/筛选/关闭） | **本地** | 体积小、首屏快 |
| 业务数据图标（精灵/道具/技能） | **CDN 远程** | 数量大、要动态 |
| 用户上传图 | **CDN 远程** | 走 CachedImage |

业务数据图标走 CDN + `CachedImage`，本地 assets 只放 app 必需的。

## 6. 注意事项

- **PNG only**：小程序不支持 SVG。`xxx.svg` 不会编译过
- **文件名约定**：全小写、下划线分隔（`home_icon.png` 不是 `HomeIcon.png`）
- **尺寸控制**：用 `mode="aspectFit"` + 父容器显式 `width/height`（见 `cached-image-container-size.md`）
- **避免 `require()`**：用 ES import，类型推断更准
- **路径别名**：项目配 `@/` alias 后可以 `import x from '@/assets/...'`（比 `../../assets/...` 易读）
- **CDN URL 不要 import**：远程图不走 import，直接 `<Image src="https://cdn..." />` + CachedImage

## 7. 验证

```bash
# 编译后看产物里的 PNG 处理
ls dist/static/*.png 2>/dev/null
ls dist/static/*/*.png 2>/dev/null

# 体积检查
du -sh dist/static
```

PNG 总量超过主包预算（~500KB 留给 assets），考虑改 CDN 远程。