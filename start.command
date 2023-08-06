#!/bin/bash
cd $( dirname -- "$0"; )

docker compose up -d --scale whisper=2

sleep 5

open http://localhost:5173
