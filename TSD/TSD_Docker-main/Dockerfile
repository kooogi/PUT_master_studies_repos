# Choose a base image
FROM node:18

# Create a working directory in the container
WORKDIR /app

# Copy package.json and package-lock.json files
COPY package.json ./
COPY yarn.lock ./

# Install dependencies
RUN yarn install

# Copy the rest of the application files
COPY . .

# Build the project
RUN yarn build

# Expose the port the app will listen on
EXPOSE 8080

# Run the application
CMD ["yarn", "dev"]
