.PHONY: install dev run

install:
	pip install -r requirements.txt

dev:
	uvicorn main:app --reload --port $(or $(PORT),8080)

run:
	uvicorn main:app --port $(or $(PORT),8080)
