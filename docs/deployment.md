# 部署方案

## 蓝绿部署
- 绿 3000 / 蓝 3001，Nginx 切流量
- `./server/deploy.sh` 自动构建→启新容器→切流量→冒烟测试
- `./server/deploy.sh rollback` 回滚

## 冒烟测试
```bash
.venv/bin/python scripts/smoke_test.py online|pre|local
```
