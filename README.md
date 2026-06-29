# create-miniprogram-scaffold

快速创建 Taro + Go 小程序项目的脚手架工具。

## 使用方式

```bash
npx create-miniprogram-scaffold [project-name]
```

### 命令行参数

```bash
# 基本用法
npx create-miniprogram-scaffold my-app

# 指定配置
npx create-miniprogram-scaffold my-app --framework React --css Sass --port 8080

# 跳过交互式提示
npx create-miniprogram-scaffold my-app --yes
```

### 参数说明

| 参数 | 说明 | 默认值 |
|------|------|--------|
| `[project-name]` | 项目名称 | - |
| `-f, --framework` | 前端框架 (React/Vue) | React |
| `-c, --css` | CSS 预处理器 (Sass/Less/Stylus/None) | Sass |
| `-p, --port` | Go 服务器端口 | 8080 |
| `-y, --yes` | 跳过交互式提示 | false |
| `--overwrite` | 覆盖已存在的目录 | false |

## 创建项目后的步骤

```bash
cd my-app

# 启动后端
cd server
go mod tidy
go run main.go

# 启动前端（新终端）
cd miniprogram
npm install
npm run dev:weapp
```

## 项目结构

```
my-app/
├── miniprogram/     # Taro 前端
│   ├── src/         # 源代码
│   ├── config/      # Taro 配置
│   └── package.json
├── server/          # Go 后端
│   ├── main.go      # 入口文件
│   ├── go.mod       # Go 模块配置
│   └── .env         # 环境变量
└── README.md
```

## API 端点

| 方法 | 路径 | 说明 |
|------|------|------|
| GET | /api/health | 健康检查 |
| GET | /api/hello | Hello World |
| POST | /api/hello | 带参数的 Hello World |

## 本地开发

```bash
# 克隆仓库
git clone git@github.com:hk029/miniprogram-scaffold.git
cd miniprogram-scaffold

# 安装依赖
cd cli && npm install

# 本地测试
node bin/cli.js create test-project --yes
```

## License

MIT