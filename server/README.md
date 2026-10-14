# Palateo backend

Better Auth, PostgreSQL and the authenticated Palo API. Install with `npm ci` in this directory and run `node index.js` for development. In-memory storage is development-only.

Production requires DATABASE_URL, a private BETTER_AUTH_SECRET (at least 32 characters), and a public HTTPS BETTER_AUTH_URL. PostgreSQL TLS verifies certificates; PGSSLMODE=disable is an explicit option for a private database network. Run the auth and application migrations before serving traffic.

No default user or password is created. Account deletion removes associated data and invalidates sessions. See docs/RELEASE_READINESS.md for staging and deployment requirements.
