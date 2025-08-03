# WereWere - Real-time Chat Application

WereWere is a modern, real-time messaging application built with a
powerful combination of Ruby on Rails and React. It leverages
a "modern monolith" architecture using Inertia.js, providing the seamless,
single-page application experience of a JavaScript frontend with the power and simplicity
of a classic server-side Rails backend.

This application is designed for instant, secure communication,
featuring real-time user presence, direct messaging, and robust contact management.

---

## Core Features

- **Real-time Messaging:** Instant message delivery and updates powered by
  Rails Action Cable.

---

## Technology Stack

- **Backend:** Ruby on Rails 7+
- **Frontend:** React 18+, Vite
- **Connecting Layer:** Inertia.js
- **Real-time:** Action Cable (WebSockets)
- **Database:** PostgreSQL
- **Authentication:** Devise
- **Styling:** Tailwind CSS, shadcn/ui
- **Client-side Validation:** Zod

---

## Getting Started

Follow these instructions to get the application running on your
local machine for development and testing purposes.

### Prerequisites

Before you begin, ensure you have the following installed on your system:

- **Ruby:** Version `3.3.0` or higher
- **Rails:** Version `7.1` or higher
- **Node.js:** Version `20.0` or higher
- **Yarn** or **npm**
- **PostgreSQL:** A running instance

### Installation

1. **Clone the repository:**

   ```bash
   git clone https://github.com/biniyamNegasa/werewere.git
   cd werewere
   ```

2. **Install backend dependencies:**

   ```bash
   bundle install
   ```

3. **Install frontend dependencies:**

   ```bash
   npm install
   ```

### Database Setup

1. **Configure your database connection:**
   Make sure your `config/database.yml` file is configured to connect to
   your local PostgreSQL instance.

2. **Create and migrate the database:**
   This command will create the database, load the schema
   from all migration files, and prepare it for use.

   ```bash
   rails db:create db:migrate
   ```

3. **(Optional) Seed the database:**
   If you have a `db/seeds.rb` file to create initial data (like test users), run:

   ```bash
   rails db:seed
   ```

### Running the Application

To run the application in a development environment,
you need to start both the Rails server and the Vite development server.

- **Launch the servers:**
  Use the `bin/dev` command, which is configured to start both processes concurrently.

  ```bash
  bin/dev
  ```

Your application should now be running and accessible at `http://localhost:3000`.

---

## How to Run the Test Suite

To run the automated tests for the application, execute the following command:

```bash
bundle exec rspec
```

---

## Deployment

To deploy this application to a production environment,
you will need to perform the following steps:

1. **Set Production Secrets:**
   Generate and set the `RAILS_MASTER_KEY` environment
   variable on your production server.

2. **Build Frontend Assets:**
   Compile and minify your JavaScript and CSS for production.

   ```bash
   vite build
   ```

3. **Precompile Rails Assets:**
   Ensure Rails can serve the optimized frontend files.

   ```bash
   RAILS_ENV=production rails assets:precompile
   ```

4. **Run Database Migrations:**
   Apply any pending migrations to your production database.

   ```bash
   RAILS_ENV=production rails db:migrate
   ```

5. **Start the Server:**
   Run the Rails server in production mode. It's recommended to
   use a process manager like `systemd` and a reverse proxy like Nginx.

   ```bash
   RAILS_ENV=production rails server
   ```
