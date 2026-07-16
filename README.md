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

- **Real-time Messaging:** Instant message delivery, read receipts, and
  presence updates powered by Rails Action Cable.
- **Direct Chats:** Start a conversation with any user by username.
- **Contacts & Blocking:** Manage contacts; blocking silences a conversation
  in both directions.
- **OAuth Sign-in:** Log in with GitHub or Google (in addition to
  username/email + password).

---

## Technology Stack

- **Backend:** Ruby on Rails 8
- **Frontend:** React 19, Vite
- **Connecting Layer:** Inertia.js
- **Real-time:** Action Cable (WebSockets)
- **Database:** PostgreSQL
- **Authentication:** Devise + OmniAuth (GitHub, Google)
- **Styling:** Tailwind CSS 4, shadcn/ui
- **State:** Zustand
- **Client-side Validation:** Zod

---

## Getting Started

Follow these instructions to get the application running on your
local machine for development and testing purposes.

### Prerequisites

- **Ruby:** the version pinned in [`.ruby-version`](.ruby-version)
  (rbenv/rvm will pick it up automatically)
- **Node.js:** Version `20.0` or higher, with **npm**
- **PostgreSQL:** either a local instance or Docker (a
  [`docker-compose.yml`](docker-compose.yml) is provided)

### Installation

1. **Clone the repository:**

   ```bash
   git clone https://github.com/biniyamNegasa/werewere.git
   cd werewere
   ```

2. **Install dependencies:**

   ```bash
   bundle install
   npm install
   ```

### Environment Variables

Configuration that can't live in git (OAuth secrets, database password)
is loaded from a `.env` file via dotenv. Start from the template:

```bash
cp .env.example .env
```

| Variable | Purpose | Required? |
| --- | --- | --- |
| `GITHUB_CLIENT_ID` / `GITHUB_CLIENT_SECRET` | GitHub OAuth sign-in | Only for "Log in with GitHub" |
| `GOOGLE_CLIENT_ID` / `GOOGLE_CLIENT_SECRET` | Google OAuth sign-in | Only for "Log in with Google" |
| `POSTGRES_PASSWORD` | Database password | No (defaults to `postgres`) |
| `DEVISE_MAILER_SENDER` | From-address for Devise emails | No |

Without the OAuth variables the app runs fine, but the GitHub/Google
buttons will fail at the provider with a "client_id is required" error.

#### Setting up the OAuth apps

- **GitHub:** [github.com/settings/developers](https://github.com/settings/developers)
  → *New OAuth App*. Set the authorization callback URL to
  `http://localhost:3000/users/auth/github/callback`, then copy the client
  ID and a generated client secret into `.env`.
- **Google:** [console.cloud.google.com/apis/credentials](https://console.cloud.google.com/apis/credentials)
  → *Create credentials* → *OAuth client ID* → *Web application*. Add
  `http://localhost:3000/users/auth/google_oauth2/callback` as an
  authorized redirect URI, then copy the client ID and secret into `.env`.

For production, register a second OAuth app per provider with your real
domain in the callback URL.

### Database Setup

**Option A — Docker (recommended):**

```bash
docker compose up -d
```

**Option B — local PostgreSQL:** make sure it accepts the `postgres`
user with the password from `POSTGRES_PASSWORD` (default `postgres`),
or adjust [`config/database.yml`](config/database.yml).

Then create and migrate the databases:

```bash
bin/rails db:prepare
```

### Running the Application

`bin/dev` starts the Rails server and the Vite dev server together:

```bash
bin/dev
```

The app is served at `http://localhost:3000`. To try the chat features,
create two accounts and open them in two separate browser sessions
(e.g. a normal and a private window).

---

## Tests and Checks

```bash
bundle exec rspec        # test suite (needs PostgreSQL running)
bundle exec rubocop      # lint
bundle exec brakeman -q  # static security analysis
```

Note: rate limiting uses the Rails cache, which is disabled in
development by default. Run `bin/rails dev:cache` to toggle it on if you
want to exercise rate limits locally.

---

## Deployment

To deploy this application to a production environment,
you will need to perform the following steps:

1. **Set Production Secrets:**
   Set `RAILS_MASTER_KEY`, `POSTGRES_PASSWORD`, the OAuth client
   IDs/secrets, and `DEVISE_MAILER_SENDER` on your production server.
   Configure SMTP (Action Mailer) if you need password-reset emails.

2. **Build Frontend Assets:**

   ```bash
   RAILS_ENV=production bin/rails assets:precompile
   ```

3. **Run Database Migrations:**

   ```bash
   RAILS_ENV=production bin/rails db:migrate
   ```

4. **Start the Server:**
   Run the Rails server in production mode behind a reverse proxy
   (a [Kamal](https://kamal-deploy.org/) config is included in
   [`config/deploy.yml`](config/deploy.yml) as a starting point).

   ```bash
   RAILS_ENV=production bin/rails server
   ```
