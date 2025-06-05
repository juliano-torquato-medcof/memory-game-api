#!/bin/sh

echo "🌱 Starting database seeding..."

echo "📊 Seeding rankings..."
bun run seed:rankings

echo "📈 Seeding stats..."
bun run seed:stats

echo "✅ Seeding completed!" 