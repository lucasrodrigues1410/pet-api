# Pet API Nest

## Description
This project is a backend API built with NestJS for managing a platform related to pet services. It likely handles features such as user and pet profiles, service listings, appointment scheduling, payments, and company management.

## Technologies Used
*   **Framework:** NestJS
*   **Language:** TypeScript
*   **Runtime:** Node.js
*   **ORM:** Prisma
*   **Database:** PostgreSQL (inferred from `docker-compose.yml` and common Prisma usage, confirm if possible, otherwise state as likely)
*   **API Documentation:** Swagger (OpenAPI) via `@nestjs/swagger`
*   **Payments:** Stripe
*   **Background Jobs/Queues:** BullMQ
*   **Image Management:** ImageKit
*   **Containerization:** Docker
*   **Package Manager & Runner:** Bun (inferred from `bun.lock` and scripts)

## Project Setup

### Prerequisites
*   Node.js (LTS version recommended)
*   Bun (v1.x or later, as `bun.lock` is present and scripts use `bun`)
*   Docker and Docker Compose (for running the database and other services)

### Installation
1.  Clone the repository:
    ```bash
    git clone <repository-url>
    cd pet-api-nest
    ```
2.  Install dependencies using Bun:
    ```bash
    bun install
    ```

### Environment Variables
Create a `.env` file in the root of the project. This file will store your environment-specific configurations. Example variables include:

```env
# Application
NODE_ENV=development
PORT=3000

# Database (Prisma) - ensure this matches your docker-compose.yml or actual DB connection
DATABASE_URL="postgresql://user:password@localhost:5432/pet_api_db?schema=public"

# Authentication (JWT)
JWT_SECRET="your-very-secret-jwt-key"
JWT_EXPIRES_IN="3600s" # Example: 1 hour

# Stripe (if payments are enabled)
STRIPE_SECRET_KEY="sk_test_yourstripenkey"
STRIPE_WEBHOOK_SECRET="whsec_yourwebhooksecret"

# ImageKit (if image uploads are enabled)
IMAGEKIT_PUBLIC_KEY="public_yourimagekitkey"
IMAGEKIT_PRIVATE_KEY="private_yourimagekitkey"
IMAGEKIT_URL_ENDPOINT="https://ik.imagekit.io/youraccount"

# BullMQ Redis (if using BullMQ for queues)
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD= # Optional, if your Redis server has a password
```
**Note:** Obtain actual keys and connection strings from your service providers and local setup.

### Database Setup
1.  **Start the database server:**
    The project includes a `docker-compose.yml` file, likely configured to run a PostgreSQL database (and potentially other services like Redis).
    ```bash
    docker-compose up -d
    ```
    Ensure Docker is running before executing this command. This will start the database server in detached mode.

2.  **Run database migrations:**
    Prisma is used for database schema management. Apply migrations to set up the database schema:
    ```bash
    bunx prisma migrate dev
    ```
    This command will create the database if it doesn't exist and apply all pending migrations.

3.  **Seed the database (optional but recommended for development):**
    The project contains seed scripts to populate the database with initial data. Check the `package.json` for the exact seed command. It's defined as `prisma.seed` which typically translates to:
    ```bash
    bunx prisma db seed
    ```
    (The `package.json` has `prisma: { "seed": "bun prisma/seed/index.ts" }`. `bunx prisma db seed` should execute this based on Prisma conventions if `prisma.seed` is defined in `package.json`'s `prisma` section.)

## Running the Application

### Development
To run the application in development mode with live reloading:
```bash
bun run dev
```
This command (from `package.json`: `bun --watch ./src/main.ts`) will start the NestJS server, and it will automatically restart when file changes are detected. The application will typically be available at `http://localhost:3000` (or the port specified in your `.env` file).

### Production
To run the application in production mode:

1.  **Build the application:**
    This command compiles the TypeScript code into JavaScript.
    ```bash
    bun run build
    ```
    (This uses the `nest build` script from `package.json`)

2.  **Start the application:**
    This command runs the compiled application.
    ```bash
    bun run start:prod
    ```
    (This uses the `bun run src/main.ts` script from `package.json`)

Ensure your `.env` file has appropriate production settings before running in this mode.

## Running Tests
To run the test suite:

```bash
bun run test
```
This command (from `package.json`: `bun test`) will execute the automated tests. Ensure the testing environment is properly configured (e.g., test database, environment variables if needed).

## API Documentation
This project uses Swagger (OpenAPI) for API documentation, enabled via the `@nestjs/swagger` package.

Once the application is running (e.g., in development mode using `bun run dev`), you can typically access the Swagger UI at:

[http://localhost:3000/api](http://localhost:3000/api)

(If you have configured a different port in your `.env` file or a custom path for Swagger, adjust the URL accordingly.)

The Swagger UI provides a user-friendly interface to explore and interact with the API endpoints, view request/response models, and test the API.

## License
This project is currently unlicensed as per the `package.json`.
