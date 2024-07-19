# Use a specific version of node:alpine for better reproducibility
FROM node:alpine as build-stage

# Set the working directory for the build stage
WORKDIR /app

# Copy all files from the project's frontend directory to the Docker image
COPY frontend/ /app/

# Install dependencies with yarn, and build the project
# No need to navigate since WORKDIR is already set
RUN yarn install
RUN yarn build

# Use a specific version of nginx:alpine for better reproducibility
FROM nginx:alpine

# Copy the built static files from the build stage to the nginx serving directory
COPY --from=build-stage /app/build/ /usr/share/nginx/html

# Copy the Nginx configuration file into the image
COPY --from=build-stage /app/nginx.conf /etc/nginx/conf.d/default.conf

# Expose port 8080 for the container
EXPOSE 8080

# Set the default command to run nginx in the foreground
CMD ["nginx", "-g", "daemon off;"]
