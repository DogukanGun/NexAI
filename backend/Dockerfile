FROM node:18-alpine As development

# Create app directory
WORKDIR /usr/src/app

# Copy application dependency manifests
COPY package*.json ./

# Install app dependencies
RUN npm install

# Copy app source code
COPY . .

# Generate Prisma client
RUN npx prisma generate

# Build the application
RUN npm run build

FROM node:18-alpine As production

# Set NODE_ENV
ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}

# Install wget for healthcheck
RUN apk add --no-cache wget

# Create app directory
WORKDIR /usr/src/app

# Copy application dependency manifests
COPY package*.json ./

# Install only production dependencies
RUN npm ci --only=production

# Copy Prisma schema and migration files
COPY --from=development /usr/src/app/prisma ./prisma

# Run Prisma generate
RUN npx prisma generate

# Copy the bundled code from the build stage
COPY --from=development /usr/src/app/dist ./dist
COPY --from=development /usr/src/app/generated ./generated

# Copy environment files
COPY .env* ./

# Expose the application port
EXPOSE 3000

# Start the server using the production build
CMD [ "node", "dist/main.js" ]
