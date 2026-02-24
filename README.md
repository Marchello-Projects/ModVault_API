<img width="3113" height="1434" alt="Group 9" src="https://github.com/user-attachments/assets/04d6a34b-c922-4403-9a9b-c903d02f1e16" />

A RESTful API for a game asset sharing platform 

## Technology Stack:

* Node.js + Express - main framework for building the API with async support
* TypeScript - static typing and safer code
* PostgreSQL - relational database for storing application data
* Prisma - ORM for working with the database
* Zod - schema validation and request data validation
* JWT (JSON Web Tokens) - authentication and endpoint protection

## Key Features:

* User registration and authentication using JWT
* CRUD operations for mods: create, read, update, delete
* Category management: admins can create, update, and delete categories, users can view them
* Mod browsing and viewing for all users
* Custom error handling: NotFoundError, ConflictError, ForbiddenError
* Endpoint protection: only mod authors or admins can manage and moderate resources

## Getting Started:

### 1. Clone the repository

```bash
git clone https://github.com/Marchello-Projects/ModVault_API
```

### 2. Install dependencies

Since this is a Node.js project, ensure you have Node.js installed, then run:

```bash
npm install
```

### 3. Set up environment variables

Create a `.env` file in the root directory with the following content:

```env
PORT=3000
DOTENV_CONFIG_QUIET=true
DATABASE_URL="postgresql://USER:PASSWORD@localhost:5432/modvault?schema=public"
SECRET_KEY=Key_for_JWT
ADMIN_EMAIL=admin@example.com
ADMIN_PASSWORD=secure_admin_password

```

> [!NOTE]
> Ensure you have a PostgreSQL database running and update the `DATABASE_URL` connection string accordingly
> The `JWT_SECRET` can be generated on the website: [https://jwtsecrets.com/](https://jwtsecrets.com/)

### 4. Database Setup (Prisma)

Before running the server, synchronize your database schema:

```bash
npx prisma migrate dev --name init
```

### 5. Running the API:

Start the development server:

```bash
npm run dev
```

The server will start, typically on port 3000 (or the one defined in `.env`)

**Obtaining JWT Tokens:**

You can test the endpoints using Postman or Insomnia

1. **Register** a new user at `POST /auth/register`
2. **Login** at `POST /auth/login` to receive your `accessToken`
3. Use this token in the `Authorization` header (`Bearer <token>`) for protected routes

## ModVault API Endpoints:

| Method | Path | Description |
| --- | --- | --- |
| **Auth** |  |  |
| POST | /auth/register | Register a new user account |
| POST | /auth/login | Authenticate a user and return a JWT token |
| GET | /auth/me | Retrieves information about the currently authenticated user |
| **Mods** |  |  |
| GET | /mod | Retrieve a list of all mods |
| POST | /mod | Upload/Create a new mod (Requires Auth & File) |
| DELETE | /mod/{id} | Delete a mod (Requires Auth) |
| PATCH | /mod/{id}/title | Update mod title (Requires Auth) |
| PATCH | /mod/{id}/description | Update mod description (Requires Auth) |
| PATCH | /mod/{id}/category | Update mod category (Requires Auth) |
| **Categories** |  |  |
| GET | /category | Get all available categories (Requires Auth) |
| POST | /category | Create a new category (Admin only) |
| PATCH | /category/{id} | Update a category (Admin only) |
| DELETE | /category/{id} | Delete a category (Admin only) |

## Build:

> [!WARNING]
> **Attention before building!**
> Before running the build command, you need to manually change the extensions in the imports of files within the project from `.ts` to `.js`
>
> * **Change:** `import ... from "./file.ts"` ⟶ `import ... from "./file.js"`
> * **Do NOT change:** Type definitions and type imports
