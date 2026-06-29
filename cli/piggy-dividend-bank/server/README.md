# Mini Scaffold Server

A simple Go backend server built with Fiber framework.

## Prerequisites

- Go 1.21 or higher

## Getting Started

### Install dependencies

```bash
go mod tidy
```

### Run the server

```bash
# Using make
make run

# Or directly
go run main.go
```

### Development mode

```bash
# Using make (requires air for hot reload)
make dev
```

## API Endpoints

### Health Check

```
GET /api/health
```

Response:
```json
{
  "code": 200,
  "message": "OK",
  "data": {
    "status": "healthy"
  }
}
```

### Hello World

```
GET /api/hello
```

Response:
```json
{
  "code": 200,
  "message": "success",
  "data": {
    "greeting": "Hello, World! 来自 Go 后端",
    "timestamp": "2024-01-01T00:00:00Z",
    "version": "1.0.0"
  }
}
```

### Hello with Name

```
POST /api/hello
Content-Type: application/json

{
  "name": "YourName"
}
```

Response:
```json
{
  "code": 200,
  "message": "success",
  "data": {
    "greeting": "Hello, YourName! 来自 Go 后端",
    "timestamp": "2024-01-01T00:00:00Z"
  }
}
```

## Configuration

The server can be configured using environment variables or a `.env` file:

- `PORT` - Server port (default: 8080)
- `APP_NAME` - Application name
- `APP_ENV` - Application environment (development/production)

## Project Structure

```
server/
├── main.go          # Entry point
├── go.mod           # Go module file
├── go.sum           # Go dependencies checksum
├── .env             # Environment variables
├── .env.example     # Example environment variables
├── Makefile         # Build and run commands
└── README.md        # This file
```

## Building for Production

```bash
# Build binary
make build

# Run binary
./bin/server
```

## Testing

```bash
make test
```

## License

MIT