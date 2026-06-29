# 蓝绿部署

参考 `docs/blue-green-deployment.md`。要点：

## 架构

- **绿环境**：端口 3000，容器 `roco-api-green`
- **蓝环境**：端口 3001，容器 `roco-api-blue`
- Nginx：`proxy_pass` 切流量
- 数据库：外置宿主机 `/root/data/`，双容器 `-v` 共享

## 部署命令

```bash
./server/deploy.sh
```

流程：
1. 备份 `server/data/roco.db`
2. 构建/推送镜像
3. 起新容器到**空闲端口**（如当前 3000 在跑，新版起 3001）
4. Nginx 切流量
5. Smoke test（`scripts/smoke_test.py`）
6. 保留旧容器不退（用于回滚）

## 回滚

```bash
./server/deploy.sh rollback
```

读取 Nginx 配置判断当前活跃端口，切到另一端口，起已停止的旧容器。

## 切换主域名

```bash
./server/deploy.sh switch
```

预发验证通过后切主域名到新版本。

## 文档

完整细节看 `docs/blue-green-deployment.md`。
