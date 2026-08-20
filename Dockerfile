# ==========================================
# Stage 1: Build the React client
# ==========================================
FROM node:18-alpine AS client-builder
WORKDIR /app/client

# Copy dependency configuration files
COPY client/package*.json ./
# Install dependencies
RUN npm install

# Copy source code and build the production assets
COPY client/ ./
RUN npm run build

# ==========================================
# Stage 2: Backend server setup with Python ML service
# ==========================================
FROM node:18-slim
WORKDIR /app

# Install Python and pip
RUN apt-get update && apt-get install -y \
    python3 \
    python3-pip \
    && rm -rf /var/lib/apt/lists/*

# Install python dependencies required to run the joblib models
RUN pip3 install --no-cache-dir --break-system-packages joblib scikit-learn

# Copy backend dependencies and install
COPY server/package*.json ./server/
WORKDIR /app/server
RUN npm install --only=production

# Copy built React client assets from Stage 1
COPY --from=client-builder /app/client/dist /app/client/dist

# Copy python service scripts and trained models
COPY Python.Service/ /app/Python.Service/

# Copy server code
COPY server/ /app/server/

# Set working directory to the server directory
WORKDIR /app/server

# Expose the default port (default is 3001, but can be overridden by environment variables)
EXPOSE 3001

# Environment configurations
ENV NODE_ENV=production
ENV PORT=3001

# Start the Node.js application
CMD ["node", "index.js"]
