# Use the official Node.js image as the base image
FROM node:20

# Set the working directory inside the container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./
COPY ./prisma ./prisma

# Install the application dependencies
RUN npm install

# Generate Prisma client
RUN npx prisma generate

# Copy the rest of the application files
COPY . .

# Build the NestJS application
RUN npm run build

# Debug: verify the build output exists
RUN ls -la dist/ && \
    echo "Main file exists: " && ls -la dist/main.js || echo "MISSING main.js"

# Expose the application port
EXPOSE 3000

# Set environment variable for better error reporting
ENV NODE_OPTIONS="--trace-warnings --unhandled-rejections=strict"

# Command to run the application using the correct start:prod script from package.json
CMD ["npm", "run", "start:prod"]