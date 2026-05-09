FROM node:22-slim AS builder

WORKDIR /app

# Copy workspace root files needed for npm ci
COPY package.json package-lock.json ./
COPY api/package.json ./api/

# Install all deps (including devDeps for the build)
RUN npm ci --workspace=api

# Copy source and build
COPY api/src ./api/src
COPY api/tsconfig.json ./api/

RUN npm run build --workspace=api

# ---

FROM node:22-slim

WORKDIR /app

COPY package.json package-lock.json ./
COPY api/package.json ./api/

# Production deps only — zeromq ships prebuilt binaries for linux-x64;
# if the prebuilt download fails the layer will error here, not at runtime.
RUN npm ci --workspace=api --omit=dev

COPY --from=builder /app/api/dist ./api/dist

EXPOSE 3001

WORKDIR /app/api

CMD ["node", "dist/server.js"]
