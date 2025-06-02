# Use Node.js as base image
FROM node:18-bullseye-slim

# Set working directory
WORKDIR /app
    
# Copy package.json and package-lock.json (or yarn.lock)
COPY package*.json ./

# Install dependencies
RUN npm ci --legacy-peer-deps

# Copy the rest of the application
COPY . .

# Build the Next.js application
RUN npm run build

# Expose the port Next.js runs on
# EXPOSE 3000˚

# Start the application
CMD ["npm", "start"]

