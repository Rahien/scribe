#!/bin/bash
cd $( dirname -- "$0"; )

git pull origin main

docker compose kill
docker compose rm
docker compose build
