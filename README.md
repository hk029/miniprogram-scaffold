# create-miniprogram-scaffold

快速创建 Taro + Go 小程序项目的脚手架工具。

## 使用

```bash
npx create-miniprogram-scaffold [project-name]
```

### 参数

| 参数 | 说明 | 默认值 |
|------|------|--------|
| `-l, --layout` | 布局: `header-tabbar` / `tabbar` / `fullscreen` / `all` | header-tabbar |
| `-f, --framework` | 框架: React / Vue | React |
| `-p, --port` | 后端端口 | 8080 |
| `-y, --yes` | 跳过提示 | false |

### 布局

| 模式 | Header | TabBar | 场景 |
|------|--------|--------|------|
| `header-tabbar` | ✅ 自定义 | ✅ | 品牌化首页 |
| `tabbar` | 原生 | ✅ | 标准列表页 |
| `fullscreen` | ❌ | ❌ | 启动页/活动页 |
| `all` | 全部 | 全部 | 推荐 |

## License

MIT
