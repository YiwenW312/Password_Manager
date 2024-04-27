# Start from a Node base image
FROM node:14

# Set the working directory in the container
WORKDIR /app

# Copy package.json and install dependencies
COPY package*.json ./
RUN npm install

# Copy the rest of your app's source code
COPY . .

# Build the React application
RUN cd client && npm install && npm run build

# Expose the port the app runs on
EXPOSE 5000

# Command to run the app
CMD ["node", "server/server.js"]
