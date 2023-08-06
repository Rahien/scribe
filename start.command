#!/bin/bash
docker compose up -d --scale whisper=2

sleep(10)

open http://localhost:5173
