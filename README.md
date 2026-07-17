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

## Deployment (Kamal)

The app deploys with [Kamal](https://kamal-deploy.org/), configured in
[`config/deploy.yml`](config/deploy.yml). Kamal builds the Docker image on
your machine, pushes it to GitHub Container Registry, and runs it on the
server behind kamal-proxy, which handles Let's Encrypt TLS and
zero-downtime deploys. Postgres runs on the same server as a Kamal
accessory.

The steps below assume an AlmaLinux (RHEL-compatible) VPS; adapt the
package commands for other distros.

### 1. One-time server setup (as root on the VPS)

```bash
# Docker CE (AlmaLinux ships Podman by default; remove the shim if present)
dnf -y remove podman-docker 2>/dev/null
dnf -y install dnf-plugins-core
dnf config-manager --add-repo https://download.docker.com/linux/centos/docker-ce.repo
dnf -y install docker-ce docker-ce-cli containerd.io
systemctl enable --now docker

# Open HTTP/HTTPS in firewalld
firewall-cmd --permanent --add-service=http --add-service=https
firewall-cmd --reload
```

SELinux can stay enforcing; Kamal uses named Docker volumes, which work
fine with it. Kamal connects as `root` over SSH by default — make sure
your SSH key is in the server's `/root/.ssh/authorized_keys`.

### 2. DNS

Point an A record for your domain at the VPS IP **before** the first
deploy — kamal-proxy needs it resolving to obtain the certificate.

### 3. Fill in config/deploy.yml

Replace the placeholders:

- `servers.web` and `accessories.db.host` — your VPS IP
- `proxy.host` — your domain

The image name and GHCR registry settings are already configured.

### 4. Secrets (on your local machine)

Create a GitHub Personal Access Token (classic) with the
`write:packages` scope for pushing images, then export everything
[`.kamal/secrets`](.kamal/secrets) expects:

```bash
export KAMAL_REGISTRY_PASSWORD=<github PAT with write:packages>
export POSTGRES_PASSWORD=<strong database password>
export GITHUB_CLIENT_ID=... GITHUB_CLIENT_SECRET=...
export GOOGLE_CLIENT_ID=... GOOGLE_CLIENT_SECRET=...
```

`RAILS_MASTER_KEY` is read from `config/master.key` automatically.

Register production OAuth apps (separate from the localhost ones) with
callback URLs `https://<your-domain>/users/auth/github/callback` and
`https://<your-domain>/users/auth/google_oauth2/callback`.

### 5. First deploy

```bash
bin/kamal setup
```

This installs Docker prerequisites on the server if needed, boots the
Postgres accessory, builds and pushes the image, and starts the app —
the container entrypoint runs `db:prepare`, creating and migrating all
four databases (primary, cache, queue, cable). kamal-proxy fetches the
TLS certificate on first request.

### 6. Redeploying

```bash
bin/kamal deploy
```

Zero-downtime: the new container boots alongside the old one, passes a
health check on `/up`, then traffic switches over.

### Useful commands

```bash
bin/kamal logs          # tail app logs
bin/kamal console       # rails console on the server
bin/kamal dbc           # rails dbconsole
bin/kamal shell         # bash inside the app container
bin/kamal rollback      # revert to the previous version
bin/kamal details       # status of app, proxy, and accessories
```
