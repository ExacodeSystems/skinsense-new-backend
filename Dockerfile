FROM node:18.16.0-alpine as base

# Add package file
COPY package.json ./
COPY .env.production ./

# Install deps
RUN yarn install

# Copy source
COPY src ./src
COPY tsconfig.json ./tsconfig.json

# Build dist
RUN yarn build

# Start production image build
FROM node:18.16.0-alpine

# Copy node modules and build directory
COPY --from=base ./node_modules ./node_modules
COPY --from=base ./package.json ./package.json
COPY --from=base ./.env.production ./.env.production
COPY --from=base /dist /dist

# Expose port 3000
EXPOSE 3000
CMD ["yarn", "start"]