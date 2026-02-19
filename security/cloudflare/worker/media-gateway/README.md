# Media Gateway Worker

This Worker enforces signed URL access for:

- `https://media.giselasaldarriaga.com/videos/main/*`

It validates:

- `st`: HMAC SHA-256 signature
- `exp`: UNIX expiry (seconds)
- payload format: `videos/main/<file>:<exp>`

## Setup

1. Copy `wrangler.toml.example` to `wrangler.toml`.
2. Configure the route and bucket binding.
3. Set secret:

```bash
wrangler secret put MEDIA_SIGNING_SECRET
```

4. Deploy:

```bash
wrangler deploy
```

## Contract

The signing format must match the Vercel session endpoint implementation in `api/media/session.ts`.
