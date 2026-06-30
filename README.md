# Webhook Inspector

A developer tool to receive, store, and inspect webhook payloads from any source.

## Why I built this
Debugging webhooks is painful — you never know exactly what payload a service sent. 
This tool captures everything so you can inspect it later.

## Tech Stack
Node.js · Express · MongoDB · express-rate-limit

## Features
- POST /webhook/:source — receive any webhook payload based on source
- GET /webhooks — fetch all webhooks with pagination
- GET /webhooks/:source — filter by source
- DELETE /webhooks/:id — delete a webhook with ID validation
- Rate limiting on POST route (10 requests/min per IP)

## Run locally
1. Clone the repo
2. Run `npm install`
3. Add `.env` with your `MONGO_URI`
4. Run `node src/app.js`

## What I'd add next
- Redis caching for frequent reads
- Authentication so only trusted sources can post
- A simple UI to view webhooks in the browser