#!/bin/bash

PROJECT_ROOT=$( cd -- "$( dirname -- "${BASH_SOURCE[0]}" )" &> /dev/null && pwd )"/.."
cd $PROJECT_ROOT
docker stop nestjs
docker rm nestjs
docker volume rm node_modules
docker compose --env-file .ops/.env/.env.dev -f ./docker/docker-compose.dev.yml up --build -d