#!/bin/bash

# Generate Prisma Client
npx prisma generate

# Build the Next.js application
npm run build
