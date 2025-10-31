# Use the official Node.js image.
FROM node:18

# Create and change to the app directory.
WORKDIR /usr/src/app

# Copy package.json and package-lock.json.
COPY package*.json ./

# Install app dependencies.
RUN npm install

# Copy the app source code.
COPY . .

# Expose the application port.
EXPOSE 4000

# Start the Node.js application.
CMD ["node", "dist/index.js"]
