from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from dotenv import load_dotenv
import os
from datetime import datetime

load_dotenv()

app = FastAPI(title="Mini Scaffold API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/api/health")
def health():
    return {"code": 0, "message": "OK", "data": {"status": "healthy"}}


@app.get("/api/hello")
def hello():
    return {
        "code": 0,
        "message": "success",
        "data": {
            "greeting": "Hello, World! 来自 Python 后端",
            "timestamp": datetime.now().isoformat(),
            "version": "1.0.0",
        },
    }


class HelloRequest(BaseModel):
    name: str = "World"


@app.post("/api/hello")
def hello_name(req: HelloRequest):
    return {
        "code": 0,
        "message": "success",
        "data": {
            "greeting": f"Hello, {req.name}! 来自 Python 后端",
            "timestamp": datetime.now().isoformat(),
        },
    }


if __name__ == "__main__":
    import uvicorn
    port = int(os.getenv("PORT", "8080"))
    uvicorn.run("main:app", host="0.0.0.0", port=port, reload=True)
