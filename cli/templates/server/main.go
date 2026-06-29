package main

import (
	"log"
	"os"

	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/cors"
	"github.com/gofiber/fiber/v2/middleware/logger"
	"github.com/gofiber/fiber/v2/middleware/recover"
	"github.com/joho/godotenv"
)

func main() {
	// Load .env file if it exists
	if err := godotenv.Load(); err != nil {
		log.Println("No .env file found, using default configuration")
	}

	// Get port from environment variable or use default
	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}

	// Create Fiber app
	app := fiber.New(fiber.Config{
		AppName:      "Mini Scaffold API",
		ServerHeader: "Mini Scaffold",
		ErrorHandler: func(c *fiber.Ctx, err error) error {
			code := fiber.StatusInternalServerError
			if e, ok := err.(*fiber.Error); ok {
				code = e.Code
			}
			return c.Status(code).JSON(fiber.Map{
				"code":    code,
				"message": err.Error(),
			})
		},
	})

	// Middleware
	app.Use(recover.New())
	app.Use(logger.New(logger.Config{
		Format: "${time} ${method} ${path} ${status} ${latency}\n",
	}))
	app.Use(cors.New(cors.Config{
		AllowOrigins: "*",
		AllowMethods: "GET,POST,PUT,DELETE,OPTIONS",
		AllowHeaders: "Origin,Content-Type,Accept,Authorization",
	}))

	// Routes
	setupRoutes(app)

	// Start server
	log.Printf("Server starting on port %s", port)
	if err := app.Listen(":" + port); err != nil {
		log.Fatalf("Failed to start server: %v", err)
	}
}

func setupRoutes(app *fiber.App) {
	// API group
	api := app.Group("/api")

	// Health check
	api.Get("/health", func(c *fiber.Ctx) error {
		return c.JSON(fiber.Map{
			"code":    200,
			"message": "OK",
			"data": fiber.Map{
				"status": "healthy",
			},
		})
	})

	// Hello world endpoint
	api.Get("/hello", func(c *fiber.Ctx) error {
		return c.JSON(fiber.Map{
			"code":    200,
			"message": "success",
			"data": fiber.Map{
				"greeting":  "Hello, World! 来自 Go 后端",
				"timestamp": "2024-01-01T00:00:00Z",
				"version":   "1.0.0",
			},
		})
	})

	// Example POST endpoint
	api.Post("/hello", func(c *fiber.Ctx) error {
		type Request struct {
			Name string `json:"name"`
		}

		var req Request
		if err := c.BodyParser(&req); err != nil {
			return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
				"code":    400,
				"message": "Invalid request body",
			})
		}

		if req.Name == "" {
			req.Name = "World"
		}

		return c.JSON(fiber.Map{
			"code":    200,
			"message": "success",
			"data": fiber.Map{
				"greeting":  "Hello, " + req.Name + "! 来自 Go 后端",
				"timestamp": "2024-01-01T00:00:00Z",
			},
		})
	})

	// Catch-all route for 404
	app.Use(func(c *fiber.Ctx) error {
		return c.Status(fiber.StatusNotFound).JSON(fiber.Map{
			"code":    404,
			"message": "Route not found",
		})
	})
}