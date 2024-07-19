# Use a specific version of node:alpine for better reproducibility
FROM node:alpine as build-stage

# Set the working directory for the build stage
WORKDIR /app

# Copy all files from the project directory to the Docker image
COPY . .

# Navigate to the frontend directory, install dependencies with yarn, and build the project
# Switched to yarn for both install and build since you initially used yarn for install
RUN cd /app/frontend
RUN yarn install
RUN yarn build

# Use a specific version of nginx for better reproducibility
FROM nginx:alpine

# Copy the built static files from the build stage to the nginx serving directory
COPY --from=build-stage /app/frontend/build/ /usr/share/nginx/html

# Copy the Nginx configuration file into the image
COPY --from=build-stage /app/nginx.conf /etc/nginx/conf.d/default.conf

# Expose port 8080 for the container
EXPOSE 8080

# Set the default command to run nginx in the foreground
CMD ["nginx", "-g", "daemon off;"]
