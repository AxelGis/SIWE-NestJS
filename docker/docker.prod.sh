#!/bin/bash

PROJECT_ROOT=$( cd -- "$( dirname -- "${BASH_SOURCE[0]}" )" &> /dev/null && pwd )"/.."
cd $PROJECT_ROOT
docker compose --env-file .ops/.env/.env.prod -f ./docker/docker-compose.prod.yml up --build -d