# Use Node.js LTS image
FROM node:18

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy all other files
COPY . .

# Expose the port
EXPOSE 5050

# Start the app
CMD ["npm", "run", "start"]