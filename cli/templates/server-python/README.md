# Python FastAPI Server

## Quick Start

```bash
pip install -r requirements.txt
python main.py
```

Or with make:

```bash
make install
make dev
```

Server runs on http://localhost:8080

## API Endpoints

| Method | Path | Description |
|--------|------|-------------|
| GET | /api/health | Health check |
| GET | /api/hello | Hello World |
| POST | /api/hello | Hello with name |

## Docs

FastAPI 自动生成文档：http://localhost:8080/docs
