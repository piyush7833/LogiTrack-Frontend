# Stage 1: Build Stage
FROM node:18 AS builder

# Set the working directory
WORKDIR /app

# Copy only the package.json and package-lock.json to leverage Docker caching
COPY package.json package-lock.json ./

# Install production dependencies
RUN npm install --production

# Copy the rest of the application code
COPY . .

# Set build-time environment variables using ARG
ARG NEXT_PUBLIC_API_URL
ARG NEXT_PUBLIC_PRICE_API_URL
ARG NEXT_PUBLIC_ORS_API_KEY
ARG NEXT_PUBLIC_WEATHER_API_KEY

# Set environment variables for Next.js build
ENV NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL
ENV NEXT_PUBLIC_PRICE_API_URL=$NEXT_PUBLIC_PRICE_API_URL
ENV NEXT_PUBLIC_ORS_API_KEY=$NEXT_PUBLIC_ORS_API_KEY
ENV NEXT_PUBLIC_WEATHER_API_KEY=$NEXT_PUBLIC_WEATHER_API_KEY

# Build the Next.js application
RUN npm run build

# Stage 2: Production Stage
FROM node:18-slim

# Set the working directory
WORKDIR /app

# Copy only the built files and necessary static assets from the builder stage
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/package.json ./
COPY --from=builder /app/node_modules ./node_modules

# Expose the necessary port
EXPOSE 3000

# Start the Next.js application
CMD ["npm", "start"]
