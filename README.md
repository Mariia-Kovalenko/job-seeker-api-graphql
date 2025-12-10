# NodeJS API Project

## Overview
This project is a NodeJS API built using Express, MongoDB, and GraphQL. It's designed to manage jobs and user authentication with features like pagination and text search.

## Features
- User authentication with JWT
- Jobs management
- Pagination for job listings
- Secure API using Express middleware

## Getting Started

### Prerequisites
- Node.js
- MongoDB

### Installation
1. Clone the repository:
   ```bash
   git clone <repository-url>
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file in the root directory and add your MongoDB URI and JWT secret:
   ```
   MONGODB_URI=your_mongodb_uri
   JWT_SECRET=your_jwt_secret
   ```
4. Build the project:
   ```bash
   npm run build
   ```

### Running the Application
- Start the server:
  ```bash
  npm start
  ```

The server will run at `http://localhost:4000`.

### Rebuild and Redeploy with Docker

To update the Docker image and redeploy:

1. **Rebuild the Docker Image**
   
   Execute the following command to rebuild the Docker image:
   
   ```bash
   docker build -t mariiatanchuk/jobs-api:latest .
   ```

2. **Push the Updated Image to Docker Hub**
   
   Make sure you are logged in to Docker Hub, then push the image:
   
   ```bash
   docker login
   docker push mariiatanchuk/jobs-api:latest
   ```

3. **Deploy the Updated Image**
   
   If you're using a service like Render or AWS:
   - Navigate to your dashboard.
   - Update the service to use the latest image tag.
   - Follow your platform's deployment procedure to apply changes.

These steps ensure your application is consistently up to date across all environments.

## API Endpoints

### GraphQL
- Access only through GraphQL at `/`.
- Use the playground to test queries and mutations.

## Development
### Dev Server
- Start the development server with
  ```bash
  npm run dev
  ```

### Linting
- Run linter with:
  ```bash
  npm run lint
  ```

## Contributing
Feel free to contribute by opening issues or submitting pull requests.

## License
This project is licensed under the MIT License.
