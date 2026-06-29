# Smoke Test 工作流

部署后用 `scripts/smoke_test.py` 跑接口冒烟。

## 用法

```bash
.venv/bin/python scripts/smoke_test.py online   # 测线上
.venv/bin/python scripts/smoke_test.py pre      # 测预发
.venv/bin/python scripts/smoke_test.py local    # 测本地
```

退出码 = 失败数，0 表示全过。

## 自动触发

`deploy.sh` 部署到预发后会自动执行 pre 环境 smoke test。

## 新增用例

编辑 `scripts/smoke_test.py` 的 `URLS` 下方，按分组加：

```python
test("新接口测试", "/api/xxx/yyy", check_code=False)  # 只验 HTTP 200
```

`check_code=True`（默认）= 校验 HTTP 200 + `code=0`，否则只验 HTTP 200。

## 为什么

部署后立刻冒烟，能在切流量前发现重大 bug；切流量后回滚成本太高。
