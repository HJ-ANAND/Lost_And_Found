---
title: Lost And Found AI
emoji: 🔍
colorFrom: indigo
colorTo: green
sdk: docker
pinned: false
---

# Lost & Found AI Platform

A modern, AI-powered platform to help people find lost items using intelligent matching and real-time chat.

## Features
- ✨ AI-enhanced item descriptions
- 🔍 Intelligent matching system
- 💬 Real-time chat for coordination
- 📧 Email notifications
- 📱 Responsive design

## Running Locally (Docker)
```bash
docker build -t lost-and-found .
docker run -p 7860:7860 -e MONGO_URI=... lost-and-found
```
