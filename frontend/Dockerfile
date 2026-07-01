FROM node:22-alpine

WORKDIR /app

# Install dependencies
COPY package.json ./
RUN npm install --legacy-peer-deps

# Copy source
COPY . .

# Expose port
EXPOSE 4200

# Start dev server
CMD ["npm", "start", "--", "--host", "0.0.0.0"]
