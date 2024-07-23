# # Use a specific version of node:alpine for better reproducibility
# FROM node:20 as build-stage

# # Update npm to the latest version and install yarn
# # Clear any existing npm cache
# RUN npm cache clean --force

# # Install npm and yarn
# RUN npm install -g npm@latest
# RUN npm install -g yarn

# # Set environment options to manage memory use better
# ENV NODE_OPTIONS="--max_old_space_size=4096"

# # Set the working directory for the build stage
# WORKDIR /app

# # Ensure the PATH includes the node_modules/.bin directory
# ENV PATH /app/node_modules/.bin:$PATH

# # Copy all files from the project's frontend directory to the Docker image
# COPY frontend/ /app/

# # Install dependencies with yarn, with verbose logging to troubleshoot potential issues
# RUN yarn install --verbose

# # Use npx to explicitly call react-scripts
# RUN npx react-scripts build

# # Use a specific version of nginx:alpine for better reproducibility
# FROM nginx:alpine

# # Copy the built static files from the build stage to the nginx serving directory
# COPY --from=build-stage /app/build/ /usr/share/nginx/html

# # Copy the Nginx configuration file into the image
# COPY --from=build-stage /app/nginx.conf /etc/nginx/conf.d/default.conf

# # Expose port 8080 for the container
# EXPOSE 8080

# # Set the default command to run nginx in the foreground
# CMD ["nginx", "-g", "daemon off;"]


FROM node:16.10-alpine3.11 AS build
WORKDIR /app
COPY frontend/package.json /app/package.json
RUN yarn install
COPY frontend/ /app/
RUN yarn build

FROM nginx:1.21-alpine
COPY --from=build /app/build /opt/site
COPY frontend/nginx.conf.template /etc/nginx/nginx.conf.template
CMD ["sh", "-c", "envsubst '$PORT' < /etc/nginx/nginx.conf.template > /etc/nginx/nginx.conf && nginx -g 'daemon off;'"]