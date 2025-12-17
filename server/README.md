# GitHub Annual Report 2025 - Backend

Backend server built with Elysia.js and Bun runtime.

## Setup

1. Install dependencies:
```bash
bun install
```

2. Create `.env` file with your GitHub OAuth credentials:
```
OAUTH_CLIENT_ID=your_github_client_id
OAUTH_CLIENT_SECRET=your_github_client_secret
```

To get GitHub OAuth credentials:
- Go to https://github.com/settings/developers
- Create a new OAuth App
- Set Authorization callback URL to: `http://localhost:3000/auth/callback`

3. Run the server:
```bash
bun run index.ts
```

Server will start at http://localhost:3000

## API Endpoints

- `GET /auth/github` - Initiates GitHub OAuth flow
- `GET /auth/callback` - OAuth callback handler
- `POST /api/graphql` - Proxy to GitHub GraphQL API
- `POST /api/ai-comment` - Generate AI comment based on persona

