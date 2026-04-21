# ── Stage 1: Build the frontend ──────────────────────────
FROM node:22-slim AS builder

WORKDIR /app

# Copy workspace-level package files
COPY package*.json ./
COPY backend/package*.json ./backend/
COPY frontend/package*.json ./frontend/

# Install ALL dependencies (including devDependencies needed for vite build)
RUN npm install

# Copy source code
COPY . .

# Set Vite env vars for the build (frontend + backend on same origin)
ENV VITE_CLERK_PUBLISHABLE_KEY=pk_test_cHJvZm91bmQtZmx5LTc1LmNsZXJrLmFjY291bnRzLmRldiQ
ENV VITE_API_URL=/api
ENV VITE_SOCKET_URL=

# Build the React frontend → generates frontend/dist/
RUN npm run build

# ── Stage 2: Production image ────────────────────────────
FROM node:22-slim

WORKDIR /app

# Copy workspace-level package files
COPY package*.json ./
COPY backend/package*.json ./backend/

# Install production dependencies only (no frontend devDeps needed)
RUN npm install --workspace=backend --omit=dev && npm cache clean --force

# Copy backend source code
COPY backend/ ./backend/

# Copy the built frontend from Stage 1
COPY --from=builder /app/frontend/dist ./frontend/dist

# Production environment
ENV NODE_ENV=production
ENV PORT=7860

EXPOSE 7860

# Start the backend (which serves the frontend static files)
CMD ["node", "backend/src/index.js"]
