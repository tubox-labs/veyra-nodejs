# Veyra Backend API Documentation (Implementation-Aware)

Last updated from source: 2026-05-04  
Codebase analyzed: `app/`, `app/api/v1/`, `app/services/`, `app/db/repositories/`, `app/models/`, `app/schemas/`, `app/core/`, `app/tasks/`, Alembic migrations, and tests.

This document is generated from actual implementation behavior. It intentionally reflects real code paths, including current limitations and edge cases.

## 1. Architecture Overview

### 1.1 High-Level Flow

1. FastAPI app is created in `app/main.py`.
2. Middleware stack runs in configured order.
3. Requests are routed to `root_router` (OpenAI-compatible root routes + health + OAuth callback) and `v1_router` (`/v1/*`).
4. Dependencies resolve authentication, authorization, DB session, Redis, and rate limits.
5. Route handlers delegate to service layer.
6. Service layer uses repository layer + provider layer + utilities.
7. Global exception handlers normalize API error envelopes.

### 1.2 Layered Structure

- `app/api/v1/*`: HTTP route handlers and request/response adaptation.
- `app/services/*`: business logic (auth, quota, billing, team, admin, assistant, etc.).
- `app/db/repositories/*`: SQLAlchemy query/update layer.
- `app/models/*`: ORM entities.
- `app/schemas/*`: Pydantic contracts.
- `app/providers/*`: external model provider abstraction + Azure OpenAI implementation.
- `app/core/*`: middleware, security, permission checks, rate-limit dependencies, exceptions.
- `app/utils/*`: sanitizer, token counting, HTTP cache helpers, validators, crypto helpers.
- `app/tasks/*`: Celery scheduled maintenance tasks.

### 1.3 Lifespan and Bootstrapping

On startup (`app/lifespan.py`):

- Configures structured logging.
- Initializes Redis connection.
- Initializes Sentry if configured.
- Optionally seeds bootstrap super-admin account (`BOOTSTRAP_ADMIN_*`).
- Enforces configured primary super-admin account stays privileged and active.

On shutdown:

- Closes Redis.
- Disposes SQLAlchemy engine.

## 2. Middleware, Shared Behavior, and Error Model

### 2.1 Middleware Order (outer -> inner)

1. `TrustedHostMiddleware`
2. `CORSMiddleware`
3. `OpenAIPathCompatibilityMiddleware`
4. `StructuredLoggingMiddleware`
5. `SecurityHeadersMiddleware`
6. `CorrelationIDMiddleware`
7. `MaintenanceModeMiddleware`
8. `IPBlocklistMiddleware`
9. `RequestSizeLimitMiddleware`

### 2.2 Middleware Effects

- `OpenAIPathCompatibilityMiddleware`: rewrites duplicated SDK paths, for example:
  - `/v1/chat/completions/chat/completions` -> `/v1/chat/completions`
  - `/chat/completions/chat/completions` -> `/chat/completions`
  - similarly for `/completions`, `/responses`, `/embeddings`, `/models`, `/images/generations`, `/audio/transcriptions`.
- `SecurityHeadersMiddleware` always injects hardened headers and sets `Cache-Control: no-store` unless endpoint sets cache headers explicitly.
- `CorrelationIDMiddleware` accepts validated `X-Request-ID` from client or generates one; returns it in response header.
- `MaintenanceModeMiddleware` returns `503 maintenance_mode` for all routes except `/health` and `/health/ready`.
- `IPBlocklistMiddleware` checks both:
  - permanent Redis set: `IP_BLOCKLIST_KEY`.
  - temporary IP block key: `RATE_LIMIT_IP_BLOCK_KEY_PREFIX + <ip>`.
- `RequestSizeLimitMiddleware` enforces global body limit (`MAX_REQUEST_BODY_SIZE_BYTES`, default 10 MB) and returns `413 payload_too_large` before route logic.

### 2.3 Global Error Envelope

Default API error shape:

```json
{
  "error": {
    "code": "some_code",
    "message": "Human-readable message"
  }
}
```

Validation errors (Pydantic/request parsing):

```json
{
  "error": {
    "code": "validation_error",
    "message": "Request validation failed",
    "details": [
      {
        "loc": ["body", "field"],
        "msg": "...",
        "type": "..."
      }
    ]
  }
}
```

Unhandled exceptions:

```json
{
  "error": {
    "code": "internal_error",
    "message": "Internal server error"
  }
}
```

### 2.4 Provider Error Sanitization

Provider-leaking strings (`azure`, `deployment`, `openai`, etc.) are sanitized before response. Public-safe provider failure message is:

- `Model provider is currently unavailable. Please try again.`

Streaming endpoints also sanitize provider-origin errors before SSE emission.

## 3. Authentication and Authorization

### 3.1 Supported Auth Types

`Authorization: Bearer <token>` supports:

- JWT access token.
- API key (`veyra_sk_...`).

### 3.2 JWT Validation Pipeline

For JWT requests:

1. Decode + verify signature/claims (`sub`, `exp`, `iat`, `jti`, `iss`).
2. Check revoked JTI in Redis (`revoked_jti:<jti>`).
3. Ensure non-revoked, non-expired DB session by JTI + active user.
4. If enabled, verify session fingerprint hash (IP/network + user-agent hash).
5. On strict mismatch: revoke session + revoke JTI + reject.

### 3.3 API Key Validation Pipeline

For API key requests:

1. Hash lookup (current hash, then legacy hash fallback).
2. Check `is_active` and `expires_at`.
3. Enforce API key IP whitelist if configured.
4. Record key usage (`last_used_at`, `last_used_ip`, `usage_count`).
5. Enforce user `api_key_access_enabled` setting.
6. Enforce permission scope checks for endpoints with `require_permission(...)`.

### 3.4 Session-Only Endpoints

`require_session_auth` rejects API keys (both via header pattern and resolved request state). Most account/admin/team routes are session-only.

### 3.5 Auth Cookies + CSRF (optional mode)

If `AUTH_COOKIE_ENABLED=true`:

- Login/refresh responses set HttpOnly refresh cookie and non-HttpOnly CSRF cookie.
- JSON `refresh_token` is intentionally blanked.
- `/v1/auth/refresh` can read refresh token from cookie.
- Cookie refresh requires CSRF header match (`AUTH_CSRF_HEADER_NAME`, default `X-CSRF-Token`) against CSRF cookie.

### 3.6 RBAC Permissions

Permission constants:

- `chat:read`, `chat:write`
- `embeddings:read`
- `images:write`
- `audio:write`
- `quota:read`, `quota:manage`
- `users:read`, `users:manage`
- `billing:read`
- `api_keys:manage`
- `admin:access`
- `models:manage`
- `conversations:read`, `conversations:write`

Role permission sets are defined in `app/core/permissions.py`; API keys must also include matching scope value.

## 4. Rate Limiting and Blocking

### 4.1 Categories

- `PUBLIC`
- `AUTH`
- `AUTH_LOGIN`
- `EXPENSIVE`
- `HEAVY`

### 4.2 Default Limits (from settings)

- `PUBLIC`: burst 60/10s, sustained 600/600s.
- `AUTH`: burst 35/10s, sustained 600/600s.
- `AUTH_LOGIN`: burst 5/60s, sustained 25/900s.
- `EXPENSIVE`: burst 15/10s, sustained 120/600s.
- `HEAVY`: burst 4/10s, sustained 30/600s.

### 4.3 429 Contract

Rate-limit failures return:

- status `429`.
- `error.code = rate_limited`.
- headers: `Retry-After`, `X-RateLimit-Limit`, `X-RateLimit-Remaining`, `X-RateLimit-Reset`.

### 4.4 Temporary IP Block Escalation

Violations can escalate to temporary IP block for categories:

- `PUBLIC`, `AUTH_LOGIN`, `EXPENSIVE`, `HEAVY`.

Not escalated for `AUTH` category (to reduce dashboard lockouts).

### 4.5 Auth Route Bucketing Detail

`AUTH` category uses route-specific identity bucket (`:path:<hash>`), so one authenticated endpoint does not consume the same exact limit bucket as another.

## 5. Quota and Model Access Enforcement

### 5.1 Quota Service (`chat` path)

For chat/completions/responses (through `LLMService`), quota flow is:

1. Resolve plan and model access.
2. Estimate prompt + output tokens.
3. Reserve against:
   - RPM sliding window.
   - TPM minute budget.
   - Daily request budget.
   - Daily token budget (reservation safety factor 1.5x).
4. Call provider.
5. Settle reservation using actual tokens.

### 5.2 Billing Gate

For free plan users, model invocation requires active billing profile. Missing billing returns `402 billing_required`.

### 5.3 User API Controls

Per-user `api_control_settings` can block model access:

- `api_access_enabled=false` blocks model endpoints.
- `enabled_models` narrows accessible models.
- `api_key_access_enabled=false` blocks API key auth globally for that user.

### 5.4 Usage Billing and Pricing

- `chat`, `completions`, and `responses` use quota reservation/settlement and append a `usage_records` row for success and recorded failures.
- `embeddings`, `images`, and `audio` enforce plan/model/billing access through the model router and append usage rows for provider calls. They use provider usage when present, tokenizer-estimated text tokens as fallback, and billing-status metadata when token data is unavailable.
- Token billing is centralized in `app/services/pricing_service.py`. It calculates input, cached-input, and output costs separately from a configurable model pricing registry.
- Each usage row stores a pricing snapshot: model profile, profile version, source, effective date, per-1M unit rates, multiplier, billing status, calculation method, and total cost.

## 6. Database Model and Relationships (API-Relevant)

Core entities:

- `users` <-1:many-> `user_sessions`
- `users` <-1:many-> `api_keys`
- `users` <-1:1(optional)-> `billing_profiles`
- `users` <-1:1(optional)-> `user_quotas`
- `user_quotas` -> `quota_plans`
- `users` <-1:many-> `usage_records` (optional `api_key_id` and `run_id` FKs; optional indexed `conversation_id`)
- `users` <-1:many-> `audit_logs` (nullable FK)
- `workspaces` (owner `users.id`)
- `workspace_members` (workspace/user membership with role)
- `workspace_invitations` (hashed invite token, status lifecycle)
- `waitlist_signups` (unique email upsert)

Also present but not exposed by current HTTP routes:

- `conversations`, `messages`.
- `llm_model_configs`.

## 7. External Integrations

- Azure OpenAI (via `openai.AsyncOpenAI`) for chat, embeddings, images, transcription.
- Google OAuth (`oauth2.googleapis.com/token`, `.../tokeninfo`) for `/v1/auth/oauth/google`.
- SMTP/console transactional email backend.
- Redis for auth/session revocation, OTP/2FA state, rate-limit, cache, quota counters.
- Celery + Redis broker/result for scheduled maintenance.
- Optional Sentry.

## 8. Environment Variables

### 8.1 Hard Requirements

- `SECRET_KEY` (required by settings; minimum length 16, >=32 recommended/required in production).

### 8.2 Core Runtime

- `APP_ENV`, `APP_NAME`, `APP_VERSION`, `DEBUG`.
- `DATABASE_URL`.
- `REDIS_URL`.
- `JWT_ALGORITHM`, `JWT_PRIVATE_KEY_PATH`, `JWT_PUBLIC_KEY_PATH` for JWT mode.
- CORS and host allowlists (`ALLOWED_HOSTS`, `CORS_*`, `TRUSTED_PROXY_IPS`).

### 8.3 Feature/Integration Variables

- Azure model provider: `AZURE_OPENAI_ENDPOINT`, `AZURE_OPENAI_API_KEY`, `AZURE_FOUNDRY_DEPLOYMENTS`.
- OAuth: `ENABLE_GOOGLE_OAUTH`, `GOOGLE_OAUTH_CLIENT_ID`, `GOOGLE_OAUTH_CLIENT_SECRET`, `GOOGLE_OAUTH_REDIRECT_URI`.
- Email: `EMAIL_BACKEND` and SMTP/EMAIL settings.
- Rate-limit/security/cookie settings (`RATE_LIMIT_*`, `AUTH_COOKIE_*`, `SESSION_FINGERPRINT_*`).
- Assistant: `ENABLE_PROJECT_ASSISTANT`, `PROJECT_ASSISTANT_*`.
- Upload limits and storage (`AVATAR_*`, `AUDIO_*`).
- Admin bootstrap controls (`BOOTSTRAP_ADMIN_*`).

### 8.4 Production Validation Behavior

In production mode, config enforces additional constraints (examples):

- no wildcard hosts/origins.
- HTTPS production URL.
- stronger `SECRET_KEY`.
- secure cookie requirements if cookie auth enabled.
- bootstrap admin safeguards if enabled.

## 9. Streaming, Events, Jobs

### 9.1 SSE Endpoints

- `POST /v1/chat/completions` when `stream=true`.
- `POST /v1/completions` when `stream=true`.
- `POST /v1/responses` when `stream=true`.
- `POST /v1/assistant/chat` when `stream=true`.
- `POST /v1/assistant/project-chat` when `stream=true`.

SSE format from `format_sse_stream`:

- each event line: `data: {json}\n\n`
- terminal line: `data: [DONE]\n\n`

### 9.2 WebSocket

- No WebSocket endpoints currently implemented.

### 9.3 Celery Scheduled Jobs

- daily quota reset: midnight UTC.
- monthly quota reset: day 1 at 00:05 UTC.
- usage aggregation scan: daily 01:30 UTC.
- expired/revoked session cleanup: daily 03:00 UTC.

## 10. API Route Inventory

The backend exposes:

- root OpenAI-compatible routes (`/chat/completions`, `/completions`, `/responses`, `/embeddings`, `/images/generations`, `/audio/transcriptions`, `/models`, `/models/{model_id}`), plus `/health`, `/health/ready`, and `/auth/google/callback`.
- equivalent `/v1/*` routes for OpenAI-compatible APIs.
- additional `/v1` product/control routes (`auth`, `users`, `team`, `api-keys`, `quota`, `billing`, `admin`, `assistant`, `help`, `waitlist`).

---

## 11. API Reference by Domain

### 11.1 Health and Public Callback

#### `GET /health`

- Purpose: liveness probe.
- Auth: none.
- Rate limit: `PUBLIC`.
- Query/body: none.
- Success `200`:

```json
{
  "status": "healthy",
  "app": "Veyra",
  "version": "1.0.0",
  "environment": "development"
}
```

- Error cases: only middleware/global failures.
- Side effects: none.
- Dependencies: settings only.

#### `GET /health/ready`

- Purpose: readiness probe (DB + Redis checks).
- Auth: none.
- Rate limit: `PUBLIC`.
- Success `200`:

```json
{
  "status": "ready",
  "checks": {
    "database": "ok",
    "redis": "ok"
  }
}
```

or degraded:

```json
{
  "status": "degraded",
  "checks": {
    "database": "error",
    "redis": "ok"
  }
}
```

- Error cases: endpoint returns degraded status instead of throwing for dependency failures.
- Side effects: none.

#### `GET /auth/google/callback`

- Purpose: backend OAuth callback receiver; redirects to frontend route.
- Auth: none.
- Rate limit: `PUBLIC`.
- Query params:
  - `code: string | null`
  - `state: string | null` (format expected: `<nonce>.<urlencoded_path>`)
  - `error: string | null`
- Success `302` with `Location` header.
- Example request:

```http
GET /auth/google/callback?code=sample&state=nonce.%2Fregister
```

- Redirect example: `https://<public-app>/register?code=sample&state=nonce.%2Fregister`
- Validation/edge cases:
  - invalid or unsafe `state` path falls back to `/login`.
  - if both `code` and `error` missing, adds `error=oauth_missing_code`.
- Side effects: none (just redirect).

### 11.2 Authentication (`/v1/auth/*`)

#### `POST /v1/auth/register`

- Purpose: create account and send verification OTP email.
- Auth: none.
- Rate limit: `AUTH`.
- Headers: `Content-Type: application/json`.
- Body:
  - `name` (required, trimmed, max 128 chars).
  - `email` (valid email).
  - `password` (8-256, plus complexity rules: upper/lower/digit/special).
- Request example:

```json
{
  "name": "Ada Lovelace",
  "email": "newuser@veyra.ai",
  "password": "StrongPassword123!"
}
```

- Success `201` (`UserRead`):

```json
{
  "id": "f0e31af2-95f5-4c95-90ce-47f2d5d6aa12",
  "name": "Ada Lovelace",
  "email": "newuser@veyra.ai",
  "username": "newuser",
  "is_active": true,
  "is_verified": false,
  "role": "user",
  "avatar_url": null,
  "has_avatar": false,
  "avatar_uploaded_at": null,
  "phone_number": null,
  "bio": null,
  "location": null,
  "website_url": null,
  "totp_enabled": false,
  "notification_preferences": {
    "security_alerts": true,
    "api_key_created": true,
    "usage_alerts": true,
    "team_collaboration": true,
    "run_failures": true,
    "billing_updates": true,
    "product_updates": false
  },
  "api_control_settings": {
    "api_access_enabled": true,
    "api_key_access_enabled": true,
    "enabled_models": []
  },
  "last_login_at": null,
  "created_at": "2026-05-03T12:34:56.000000Z"
}
```

- Error cases:
  - `409 conflict`: duplicate email (case-insensitive).
  - `422 validation_error`: missing/blank name, malformed email, weak password.
  - `429 rate_limited`.
- Side effects:
  - inserts `users` row.
  - stores provided `name` on user profile.
  - generates username (collision-safe).
  - stores hashed password.
  - writes OTP payload to Redis.
  - sends welcome + verification email.
  - emits `user.registered` domain event.

#### `POST /v1/auth/login`

- Purpose: authenticate with email or username.
- Auth: none.
- Rate limit: `AUTH_LOGIN` + extra anti-stuffing checks by IP and identifier bucket.
- Body:
  - one of `identifier`, `email`, `username`, or `login` (one required).
  - `password`.
  - optional `include_user: boolean` (default `false`) to include compact user metadata in response.
- Request example:

```json
{
  "identifier": "testuser",
  "password": "TestPass123!@#"
}
```

- Success `200` when no 2FA:

```json
{
  "access_token": "<jwt>",
  "refresh_token": "<refresh>",
  "token_type": "bearer",
  "expires_in": 900
}
```

- Success `200` (same as above) can include user payload when `include_user=true`:

```json
{
  "access_token": "<jwt>",
  "refresh_token": "<refresh>",
  "token_type": "bearer",
  "expires_in": 900,
  "user": {
    "id": "6ef96cd3-9f92-4b26-94c2-7564b77f89f7",
    "email": "test@veyra.ai",
    "name": "Test User",
    "username": "testuser",
    "role": "user",
    "is_active": true,
    "is_verified": true,
    "totp_enabled": false
  }
}
```

- Success `200` when 2FA enabled:

```json
{
  "status": "2fa_required",
  "session_token": "<temp_5min_token>"
}
```

- Error cases:
  - `401 invalid_credentials`.
  - `401 account_locked`.
  - `403 email_not_verified`.
  - `403 ip_temporarily_blocked` (middleware).
  - `429 rate_limited`.
- Validation/behavior:
  - email and username lookup are case-insensitive.
  - account lockout uses exponential backoff after threshold.
  - unverified login triggers throttled verification resend.
- Side effects:
  - updates failed-login counters and lock state.
  - may send account lock email.
  - on success creates `user_sessions` record and updates last login.
  - clears temporary IP block state on successful login path.

#### `POST /v1/auth/verify-2fa`

- Purpose: complete login using TOTP after `2fa_required`.
- Auth: none.
- Rate limit: `AUTH_LOGIN`.
- Body:
  - `session_token`.
  - `code` (exactly 6 digits).
  - optional `include_user: boolean` (default `false`).
- Request:

```json
{
  "session_token": "<temp_token>",
  "code": "123456"
}
```

- Success `200`: same `TokenResponse` as login.
- Error cases:
  - `401 token_error` for expired/invalid temp session.
  - `401 2fa_invalid` invalid/replayed code.
  - `429 rate_limited`.
- Side effects:
  - stores short-lived anti-replay key `2fa_used:*` in Redis.
  - deletes temporary 2FA session key.
  - issues session/token pair.

#### `POST /v1/auth/oauth/google`

- Purpose: login/register via Google OAuth code exchange.
- Auth: none.
- Rate limit: `AUTH_LOGIN`.
- Body:
  - `code`.
  - `redirect_uri`.
  - optional `include_user: boolean` (default `false`).
- Request:

```json
{
  "code": "sample-auth-code",
  "redirect_uri": "http://localhost:8000/auth/google/callback"
}
```

- Success `200`: `TokenResponse`.
- Error cases:
  - `401 oauth_google_disabled`, `oauth_google_invalid_redirect_uri`, `oauth_google_invalid_token`, etc.
  - `503 oauth_google_not_configured`.
- Side effects:
  - if user missing, creates verified account with generated username/password.
  - may send welcome email.
  - issues session/token pair.

#### `POST /v1/auth/refresh`

- Purpose: rotate refresh token and issue new access token.
- Auth: none (token or cookie-based flow).
- Rate limit: `AUTH`.
- Body (token mode):
  - `refresh_token`.
  - optional `include_user: boolean` (default `false`).
- Cookie mode headers:
  - `X-CSRF-Token` matching CSRF cookie.
- Request (token mode):

```json
{
  "refresh_token": "<refresh>"
}
```

- Success `200`:

```json
{
  "access_token": "<jwt>",
  "refresh_token": "<new_refresh_or_empty_if_cookie_mode>",
  "token_type": "bearer",
  "expires_in": 900
}
```

- Error cases:
  - `400 invalid_request` when missing refresh token (non-cookie mode).
  - `401 token_error` invalid/reused/expired token.
  - `403 csrf_invalid` in cookie mode when CSRF check fails.
- Validation/behavior:
  - refresh rotation is single-use.
  - detects reuse; may treat near-simultaneous same-device reuse as benign race.
  - malicious reuse revokes all sessions and sends security alert email.
  - strict session fingerprint mismatch rejects refresh and revokes session.
- Side effects:
  - revokes old session + old JTI.
  - creates new session.
  - writes `refresh_used:*` marker in Redis.

#### `POST /v1/auth/logout`

- Purpose: revoke current session or all sessions.
- Auth: session JWT required (`require_session_auth`); API key forbidden.
- Rate limit: authenticated `AUTH`.
- Body:
  - `all_sessions: bool` (default `false`).
- Request:

```json
{
  "all_sessions": true
}
```

- Success `200`:

```json
{
  "message": "Logged out successfully"
}
```

- Error cases:
  - `403 permission_denied` if API key used.
  - `401` invalid token.
- Side effects:
  - sets revoked JTI key(s) in Redis.
  - revokes DB session(s).
  - clears auth cookies if cookie mode enabled.
  - emits `user.logout` event.

#### `POST /v1/auth/verify-email`

- Purpose: verify account email using OTP.
- Auth: none.
- Rate limit: `AUTH`.
- Body:
  - `email`.
  - `code` (4-10 digits; effectively checked against configured OTP length).
- Request:

```json
{
  "email": "newuser@veyra.ai",
  "code": "123456"
}
```

- Success `200`:

```json
{
  "message": "Email verified successfully"
}
```

- Error cases:
  - `400 http_error` with message `Invalid or expired verification code`.
- Side effects:
  - marks `users.is_verified=true`.
  - clears OTP and attempts keys in Redis.

#### `POST /v1/auth/request-email-verification`

- Purpose: resend verification OTP for unverified account.
- Auth: none.
- Rate limit: `AUTH`.
- Body:

```json
{
  "email": "newuser@veyra.ai"
}
```

- Success `200`:

```json
{
  "message": "If the account exists, a verification code has been sent"
}
```

- Error cases: validation errors only.
- Side effects:
  - non-enumerating behavior.
  - resend throttled (5 minutes/account key in Redis).

#### `POST /v1/auth/password-reset/request`

- Purpose: request password reset email.
- Auth: none.
- Rate limit: `AUTH`.
- Body:

```json
{
  "email": "test@veyra.ai"
}
```

- Success `200`:

```json
{
  "message": "If the account exists, a password reset email has been sent"
}
```

- Side effects:
  - non-enumerating behavior.
  - sends signed reset token email for existing account only.

#### `POST /v1/auth/password-reset/confirm`

- Purpose: finalize password reset.
- Auth: none.
- Rate limit: `AUTH`.
- Body:

```json
{
  "token": "<signed_token>",
  "new_password": "BrandNewPass123!@#"
}
```

- Success `200`:

```json
{
  "message": "Password has been reset successfully"
}
```

- Error cases:
  - `400 http_error` invalid or expired token.
- Side effects:
  - updates password hash.
  - revokes all sessions.
  - enforces single-use token marker in Redis.

#### `POST /v1/auth/2fa/setup`

- Purpose: generate TOTP setup secret and QR.
- Auth: session JWT (`require_session_auth`), active user.
- Rate limit: authenticated `AUTH`.
- Success `200`:

```json
{
  "secret": "BASE32SECRET",
  "provisioning_uri": "otpauth://totp/Veyra:test%40veyra.ai?...",
  "qr_code_base64": "iVBORw0KGgoAAA..."
}
```

- Error cases:
  - `409 conflict` when already enabled.
- Side effects:
  - stores encrypted TOTP secret (not yet enabled).

#### `POST /v1/auth/2fa/enable`

- Purpose: enable TOTP after verifying initial code.
- Auth: session JWT.
- Rate limit: authenticated `AUTH`.
- Body:

```json
{
  "code": "123456"
}
```

- Success `200` message.
- Error cases:
  - `400 http_error` invalid TOTP code.
- Side effects:
  - sets `totp_enabled=true`.
  - sends security alert email.

#### `POST /v1/auth/2fa/disable`

- Purpose: disable TOTP with password + current code.
- Auth: session JWT.
- Rate limit: authenticated `AUTH`.
- Body:

```json
{
  "current_password": "TestPass123!@#",
  "code": "123456"
}
```

- Success `200`:

```json
{
  "message": "Two-factor authentication disabled. Please sign in again."
}
```

- Error cases:
  - `401 current_password_invalid`.
  - `401 2fa_invalid`.
  - `422 validation_error` if 2FA not enabled.
- Side effects:
  - clears TOTP secret and enabled flag.
  - revokes all sessions.

#### `POST /v1/auth/change-password`

- Purpose: change password from authenticated session.
- Auth: session JWT.
- Rate limit: authenticated `AUTH`.
- Body:

```json
{
  "current_password": "TestPass123!@#",
  "new_password": "NewPass12!"
}
```

- Success `200` message.
- Error cases:
  - `401 current_password_invalid`.
  - `409 conflict` if new equals current.
  - `422 validation_error` for weak new password.
- Side effects:
  - updates password hash.
  - revokes all sessions and current JTI.
  - sends security alert email.

#### `GET /v1/auth/sessions`

- Purpose: list account sessions.
- Auth: session JWT.
- Rate limit: authenticated `AUTH`.
- Query params:
  - `offset` (>=0, default 0).
  - `limit` (1-100, default 20).
- Success `200`:

```json
{
  "sessions": [
    {
      "id": "0d7f5d37-810c-48b9-8d8a-b4f30e0ea6b3",
      "ip_address": "127.0.0.1",
      "user_agent": "python-httpx/0.28.1",
      "created_at": "2026-05-03T12:34:56.000000Z",
      "expires_at": "2026-06-02T12:34:56.000000Z",
      "is_revoked": false,
      "is_current": true,
      "status": "active"
    }
  ],
  "total": 1,
  "offset": 0,
  "limit": 20,
  "has_more": false,
  "next_offset": null
}
```

- Status derivation: `active` / `expired` / `revoked` computed server-side.
- Side effects: none.

#### `DELETE /v1/auth/sessions/{session_id}`

- Purpose: revoke specific session belonging to current user.
- Auth: session JWT.
- Rate limit: authenticated `AUTH`.
- Path param: `session_id` (UUID).
- Success `200`:

```json
{
  "message": "Session revoked"
}
```

- Error cases:
  - `404 not_found` unknown session.
  - `403 permission_denied` if session belongs to another user.
- Side effects:
  - marks session revoked.
  - revokes associated access JTI in Redis.

### 11.3 Users (`/v1/users/*`)

All user endpoints are under authenticated `AUTH` rate limit at router-level.

#### `GET /v1/users/me`

- Purpose: current profile.
- Auth: session JWT only (API keys forbidden).
- Success `200`: `UserProfile` full payload (same shape as `UserRead` + `last_login_ip`, `updated_at`).
- Side effects: none.

#### `PATCH /v1/users/me`

- Purpose: update own profile fields.
- Auth: session JWT.
- Body fields (all optional):
  - `name`, `username`, `avatar_url`, `phone_number`, `bio`, `location`, `website_url`.
- Request:

```json
{
  "name": "Ada Lovelace",
  "username": "renamed_user",
  "bio": "Backend engineer",
  "location": "Bengaluru"
}
```

- Success `200`: updated `UserProfile`.
- Error cases:
  - `409 conflict` username taken.
  - `422 validation_error` invalid name/username/phone/url/bio length/location length.
- Side effects:
  - updates `users` row.
  - invalidates user dashboard cache keys.
- Notes:
  - Email is immutable via this endpoint; unknown fields are ignored by schema.

#### `POST /v1/users/me/avatar`

- Purpose: upload private avatar.
- Auth: session JWT.
- Rate limit: authenticated `HEAVY` additionally.
- Headers: `Content-Type: multipart/form-data`.
- Form field: `file` (image file).
- Allowed types: `image/png`, `image/jpeg`, `image/webp`, `image/gif`.
- Signature validation enforced per type.
- Max upload bytes endpoint-level: `AVATAR_MAX_SIZE_BYTES` (default 2 MB).
- Success `200`:

```json
{
  "has_avatar": true,
  "content_type": "image/png",
  "size_bytes": 12345,
  "uploaded_at": "2026-05-03T12:34:56.000000Z"
}
```

- Error cases:
  - `422 validation_error` unsupported type, empty file, invalid signature, too large.
  - `503 storage_unavailable` file-system backend issue.
- Side effects:
  - stores file under `AVATAR_STORAGE_DIR/<user_id>/<random>.<ext>`.
  - updates avatar storage metadata in `users`.
  - clears legacy `avatar_url`.
  - invalidates user cache.

#### `GET /v1/users/me/avatar`

- Purpose: fetch private avatar bytes.
- Auth: session JWT.
- Success `200`: raw bytes with image `Content-Type`.
- Response headers include `Cache-Control: private, no-store`.
- Error cases:
  - `404 not_found` when no avatar.
- Side effects: none.

#### `DELETE /v1/users/me/avatar`

- Purpose: delete private avatar.
- Auth: session JWT.
- Success `200` message.
- Side effects:
  - deletes file if present.
  - clears avatar metadata fields.
  - invalidates user cache.

#### `GET /v1/users/me/notifications`

- Purpose: read notification preferences.
- Auth: session JWT.
- Success `200`:

```json
{
  "security_alerts": true,
  "api_key_created": true,
  "usage_alerts": true,
  "team_collaboration": true,
  "run_failures": true,
  "billing_updates": true,
  "product_updates": false
}
```

- Side effects: none.

#### `PUT /v1/users/me/notifications`

- Purpose: partial update of notification preferences.
- Auth: session JWT.
- Body: any subset of boolean notification fields.
- Success `200`: merged preferences object.
- Side effects:
  - updates JSON field on user.
  - invalidates user cache.

#### `GET /v1/users/me/activity`

- Purpose: account activity feed (audit + usage blended).
- Auth: session JWT.
- Query params:
  - `offset` (>=0, default 0)
  - `limit` (1-100, default 30)
- Success `200` (`ActivityFeedResponse`).
- Caching:
  - ETag/304 supported.
  - private cache headers: `private, max-age=<ttl>, must-revalidate, stale-while-revalidate=<2*ttl>`.
  - `Vary: Authorization`.
- Side effects: none.
- Notes:
  - feed is built from audit logs and usage records.
  - severity for usage is derived from status code.

#### `GET /v1/users/me/api-controls`

- Purpose: read API access/model controls + plan-available models.
- Auth: session JWT.
- Success `200`:

```json
{
  "api_access_enabled": true,
  "api_key_access_enabled": true,
  "enabled_models": ["gpt-5.4-mini"],
  "available_models": ["gpt-5.4-mini", "gpt-5.4"]
}
```

- Side effects: none.

#### `PUT /v1/users/me/api-controls`

- Purpose: update model/API controls.
- Auth: session JWT.
- Body fields (optional):
  - `api_access_enabled`.
  - `api_key_access_enabled`.
  - `enabled_models`.
- Validation:
  - selected models are intersected with currently available plan models.
  - if `api_access_enabled=true`, resulting `enabled_models` cannot be empty.
- Success `200`: updated controls + available models.
- Error cases:
  - `422 validation_error` for empty model selection while API access enabled.
- Side effects:
  - updates user JSON settings.
  - invalidates user cache.

#### `GET /v1/users`

- Purpose: legacy super-admin user listing.
- Auth: super-admin session only.
- Query:
  - `offset` (>=0, default 0)
  - `limit` (1-100, default 50)
- Success `200` (`UserListResponse`).
- Notes:
  - `total` currently equals length of returned page, not full DB count.

#### `PATCH /v1/users/{user_id}`

- Purpose: legacy super-admin patch of user flags/role.
- Auth: super-admin session only.
- Body (`AdminUserUpdate`): `role`, `is_active`, `is_verified`, `is_superuser`.
- Success `200`: `UserRead`.
- Side effects: updates user record.

### 11.4 Team and Workspace (`/v1/team/*`)

All team routes require:

- session JWT (`require_session_auth`)
- authenticated `AUTH` rate limit.

Role model inside workspace:

- `owner`, `admin`, `member`, `viewer`

Manage actions allowed for `owner` and `admin` only; owner is immutable.

#### `GET /v1/team/workspace`

- Purpose: resolve active workspace and return summary.
- Behavior:
  - auto-provisions personal workspace + owner membership when absent.
- Success `200` (`WorkspaceRead`).

#### `GET /v1/team/members`

- Purpose: list members for resolved workspace.
- Success `200`: array of `TeamMemberRead` sorted by role priority then username.

#### `PATCH /v1/team/members/{member_id}`

- Purpose: update member role (`admin|member|viewer`).
- Body:

```json
{ "role": "member" }
```

- Success `200`: updated `TeamMemberRead`.
- Error cases:
  - `403 permission_denied` insufficient actor role.
  - `403 permission_denied` admin attempting to promote another admin.
  - `422 validation_error` self-role change blocked.
  - `404 not_found` unknown member.
- Side effects:
  - updates member role.
  - creates workspace audit log.
  - sends collaboration email to opted-in members.

#### `DELETE /v1/team/members/{member_id}`

- Purpose: remove member.
- Success `200` message.
- Error cases:
  - cannot remove self (`422`).
  - cannot remove owner (`403`).
- Side effects:
  - deletes membership row.
  - audit log + member notifications.

#### `GET /v1/team/invites`

- Purpose: list invitations for workspace.
- Success `200`: array of `TeamInviteRead`.
- Behavior:
  - stale pending invites are auto-marked `expired` before listing.

#### `POST /v1/team/invites`

- Purpose: create invite.
- Body:

```json
{
  "email": "invitee@veyra.ai",
  "role": "member",
  "expires_in_days": 7
}
```

- Success `200`:

```json
{
  "invite": {
    "id": "...",
    "email": "invitee@veyra.ai",
    "role": "member",
    "status": "pending",
    "invited_by_user_id": "...",
    "invited_by_name": "owner",
    "invited_by_email": "owner@veyra.ai",
    "invited_user_id": null,
    "created_at": "...",
    "updated_at": "...",
    "expires_at": "...",
    "last_sent_at": "...",
    "accepted_at": null,
    "revoked_at": null
  },
  "invite_link": "https://<public-app>/dashboard/team?invite_token=<raw_token>"
}
```

- Error cases:
  - `409 conflict` existing pending invite for same email.
  - `409 conflict` user already active member.
  - `422 validation_error` self-invite or seat-limit reached.
- Side effects:
  - stores invite row with hashed token only.
  - sends invite email with raw token in link.
  - audit log + collaboration notifications.

#### `POST /v1/team/invites/{invitation_id}/resend`

- Purpose: resend pending invite and rotate token.
- Success `200`: same shape as create invite.
- Error cases:
  - `422` if invite not pending.
  - `404` invite not found.
- Side effects:
  - rotates token hash.
  - resets expiry to now + 7 days.
  - sends email + audit + notifications.

#### `DELETE /v1/team/invites/{invitation_id}`

- Purpose: revoke pending invite.
- Success `200`: `TeamInviteRead` with `status=revoked`.
- Side effects: sets `revoked_at`, audit log, notifications.

#### `POST /v1/team/invites/accept`

- Purpose: accept invite by token.
- Body:

```json
{ "token": "<raw_invite_token>" }
```

- Success `200`: `WorkspaceRead` summary for joined workspace.
- Error cases:
  - `404` token not found.
  - `422` invite expired/invalid state.
  - `403` invite email does not match authenticated account.
- Side effects:
  - creates or reactivates membership.
  - marks invite accepted with `accepted_at`.
  - audit log + notifications.

#### `GET /v1/team/collaboration/activity`

- Purpose: list workspace collaboration audit trail.
- Query: `limit` (1-100, default 30).
- Success `200`: array of `TeamActivityRead`.
- Side effects: none.

### 11.5 API Keys (`/v1/api-keys/*`)

Router-level requirements:

- permission: `api_keys:manage`.
- authenticated `AUTH` rate limit.
- API keys are allowed if they carry matching scope and user allows API-key auth.

#### `POST /v1/api-keys`

- Purpose: create new API key (secret shown once).
- Body:

```json
{
  "name": "automation-key",
  "scopes": ["chat:read", "chat:write"],
  "ip_whitelist": ["203.0.113.0/24"],
  "expires_in_days": 30
}
```

- Success `201`:

```json
{
  "id": "...",
  "name": "automation-key",
  "key": "veyra_sk_...",
  "key_prefix": "veyra_sk_ab",
  "scopes": ["chat:read", "chat:write"],
  "created_at": "..."
}
```

- Validation:
  - scope values must map to known permission values.
  - whitelist entries must be valid IP/CIDR.
- Error cases:
  - `403 api_key_limit_exceeded` by plan (free 5, pro 15, team 30, enterprise 100).
- Side effects:
  - inserts hashed key only.
  - emits `api_key.created` event.
  - sends email notification if enabled.
  - invalidates user dashboard caches.

#### `GET /v1/api-keys`

- Purpose: list current user's keys (no secret values).
- Success `200`: array of `APIKeyRead`.
- Caching: ETag + private cache headers; `Vary: Authorization`.

#### `PATCH /v1/api-keys/{key_id}`

- Purpose: update mutable key fields.
- Body (all optional): `name`, `scopes`, `ip_whitelist`, `rate_limit_override`, `expires_in_days`.
- Success `200`: updated `APIKeyRead`.
- Error cases:
  - `404` key not found.
  - `403` key belongs to another user.
- Notes:
  - `rate_limit_override` is stored but not currently enforced by request rate-limit pipeline.

#### `DELETE /v1/api-keys/{key_id}`

- Purpose: revoke key.
- Success `200`:

```json
{ "message": "API key revoked" }
```

- Error cases: `404`, `403`.
- Side effects:
  - sets `is_active=false`, `revoked_at`.
  - emits `api_key.revoked` event.
  - invalidates user caches.

### 11.6 Quota (`/v1/quota/*`)

#### `GET /v1/quota/status`

- Purpose: current quota usage and limits.
- Auth: permission `quota:read` + authenticated (JWT or scoped API key).
- Rate limit: authenticated `AUTH`.
- Success `200` (`QuotaStatusResponse`):

```json
{
  "plan": "free",
  "limits": {
    "daily_tokens": 40000,
    "daily_requests": 50,
    "rpm": 10,
    "tpm": 10000,
    "max_context_tokens": 16384,
    "max_output_tokens": 2048
  },
  "usage": {
    "tokens_used_today": 100,
    "tokens_remaining_today": 39900,
    "requests_used_today": 1,
    "requests_remaining_today": 49,
    "percentage_used": 0.3
  },
  "resets_at": "2026-05-04T00:00:00+00:00",
  "time_until_reset": "5h 10m 4s"
}
```

- Caching: ETag + private cache headers + `Vary: Authorization`; supports `304`.
- Side effects: none.

#### `GET /v1/quota/plans`

- Purpose: list active plans (auth-protected).
- Auth: same as quota router.
- Success `200`: array of `QuotaPlanRead`.
- Side effects:
  - calls `ensure_default_plans`, creating/updating canonical plans if needed.

#### `GET /v1/quota/plans/public`

- Purpose: public plan list for pricing pages.
- Auth: none.
- Rate limit: `PUBLIC`.
- Success `200`: same plan payload as `/v1/quota/plans`.
- Side effects: also seeds defaults if missing.

### 11.7 Billing (`/v1/billing/*`)

Router-level requirements:

- permission `billing:read`.
- authenticated `AUTH` rate limit.

#### `GET /v1/billing/usage`

- Purpose: list user's usage records.
- Query params:
  - `since` datetime optional.
  - `until` datetime optional.
  - `model` optional.
  - `offset` >=0 default 0.
  - `limit` 1-500 default 50.
- Success `200`: array of `UsageRecordRead`.
  - Each row includes token counts, input/output/cached/extras costs, unit rates per 1M tokens, pricing profile/version/source, pricing multiplier, billing status, calculation method, and optional `conversation_id`.
- Caching: ETag + private cache headers + `304` support.

#### `GET /v1/billing/usage/summary/daily`

- Purpose: aggregated usage for current day (UTC).
- Success `200`:

```json
{
  "prompt_tokens": 1200,
  "completion_tokens": 800,
  "total_tokens": 2000,
  "request_count": 10
}
```

- Caching: ETag + private cache headers.

#### `GET /v1/billing/usage/summary/monthly`

- Purpose: aggregated usage for month.
- Query params: `year`, `month` (optional; defaults current UTC year/month).
- Success `200`: same summary shape as daily.
- Caching: ETag + private cache headers.

#### `GET /v1/billing/usage/conversations/{conversation_id}/summary`

- Purpose: aggregate token and cost usage for one conversation.
- Success `200`:

```json
{
  "prompt_tokens": 1200,
  "completion_tokens": 800,
  "total_tokens": 2000,
  "cached_tokens": 200,
  "total_cost_usd": 0.012345,
  "request_count": 10
}
```

- Caching: ETag + private cache headers.

#### `GET /v1/billing/profile`

- Purpose: fetch billing profile.
- Success:
  - `200` with `null` if no profile.
  - `200` with `BillingProfileRead` object when present.

#### `PUT /v1/billing/profile`

- Purpose: create/update billing profile.
- Body: full `BillingProfileUpsert` (address + identity + optional full card bundle).
- Request example:

```json
{
  "billing_email": "billing@veyra.ai",
  "full_name": "Veyra Billing",
  "company_name": "Veyra Labs",
  "country_code": "US",
  "line1": "123 Main St",
  "line2": null,
  "city": "Austin",
  "state_region": "TX",
  "postal_code": "78701",
  "tax_id": null,
  "card_brand": null,
  "card_last4": null,
  "card_exp_month": null,
  "card_exp_year": null
}
```

- Success `200`: `BillingProfileRead`.
- Validation:
  - if any card field is present, all card fields must be present.
- Side effects:
  - upsert row in `billing_profiles`.
  - optional billing-update email notification.
  - invalidates user cache.

#### `GET /v1/billing/access`

- Purpose: evaluate whether current user can invoke model endpoints.
- Success `200` (`BillingAccessStatus`):

```json
{
  "plan": "free",
  "billing_required": true,
  "can_use_models": false,
  "reason": "Add billing profile details to unlock model usage on Free tier"
}
```

- Caching: ETag + private cache headers.

### 11.8 OpenAI-Compatible Core APIs

These handlers are mounted both at root and `/v1`:

- `/chat/completions` and `/v1/chat/completions`
- `/completions` and `/v1/completions`
- `/responses` and `/v1/responses`
- `/embeddings` and `/v1/embeddings`
- `/images/generations` and `/v1/images/generations`
- `/audio/transcriptions` and `/v1/audio/transcriptions`
- `/models` and `/v1/models`
- `/models/{model_id}` and `/v1/models/{model_id}`

Auth for these endpoints can be JWT or API key, unless otherwise noted. API key scopes must match endpoint permission requirements.

Provider routing for chat-like operations:
- Codex model aliases (for example `gpt-5.3-codex`) are routed to Azure/OpenAI Responses API upstream calls (`client.responses.create(model=<deployment>, input=<...>)`).
- Non-Codex chat models (for example `gpt-5.4-mini`) continue to use chat-completions upstream calls.
- Gateway responses remain OpenAI-compatible for each external endpoint (`/chat/completions`, `/completions`, `/responses`) regardless of upstream route selection.

#### 11.8.1 `POST /v1/chat/completions` (also `/chat/completions`)

- Purpose: OpenAI-compatible chat completions with optional SSE stream.
- Auth/permission:
  - permission `chat:write`.
  - authenticated `EXPENSIVE` rate limit.
- Request body: `ChatCompletionRequest`.
- Request example:

```json
{
  "model": "gpt-5.4-mini",
  "messages": [
    {"role": "system", "content": "You are concise."},
    {"role": "user", "content": "Say hello"}
  ],
  "stream": false,
  "temperature": 0.2,
  "max_completion_tokens": 200
}
```

- Success `200` non-stream:

```json
{
  "id": "chatcmpl-abc",
  "object": "chat.completion",
  "created": 1714723200,
  "model": "gpt-5.4-mini",
  "choices": [
    {
      "index": 0,
      "message": {"role": "assistant", "content": "Hello."},
      "finish_reason": "stop"
    }
  ],
  "usage": {
    "prompt_tokens": 10,
    "completion_tokens": 3,
    "total_tokens": 13
  },
  "system_fingerprint": null
}
```

- Success `200` stream (`text/event-stream`):

```text
data: {"id":"chatcmpl-...","object":"chat.completion.chunk","created":1714723200,"model":"gpt-5.4-mini","choices":[{"index":0,"delta":{"role":"assistant","content":"Hel"},"finish_reason":null}]}

data: {"id":"chatcmpl-...","object":"chat.completion.chunk","created":1714723200,"model":"gpt-5.4-mini","choices":[{"index":0,"delta":{"content":"lo"},"finish_reason":null}]}

data: [DONE]
```

- Error cases:
  - `400 prompt_injection` for detected injection patterns.
  - `402 billing_required` on free plan without billing profile.
  - `403 model_not_available` / `permission_denied`.
  - `429` quota/rate limits.
  - `502/503` provider issues (sanitized).
- Validation/processing:
  - message content sanitized.
  - known injection patterns block request.
  - user field in provider request is forcibly set to current user ID.
- Side effects:
  - quota reservation/settlement.
  - usage record insertion into `usage_records` (including failures where possible).
  - optional run-failure email notifications.

#### 11.8.2 `POST /v1/completions` (also `/completions`)

- Purpose: legacy text completion API adapted to chat backend.
- Auth/permission: same as chat completions (`chat:write`, `EXPENSIVE`).
- Body highlights:
  - `prompt: string | [string]`.
  - multi-prompt arrays (`len > 1`) are rejected.
  - `max_completion_tokens` maps to provider `max_tokens`.
- Request example:

```json
{
  "model": "gpt-5.4-mini",
  "prompt": "Write one short greeting",
  "stream": false,
  "max_tokens": 64
}
```

- Success `200`:

```json
{
  "id": "chatcmpl-adapted",
  "object": "text_completion",
  "created": 1714723200,
  "model": "gpt-5.4-mini",
  "choices": [
    {
      "text": "Hello!",
      "index": 0,
      "logprobs": null,
      "finish_reason": "stop"
    }
  ],
  "usage": {
    "prompt_tokens": 7,
    "completion_tokens": 2,
    "total_tokens": 9
  }
}
```

- Stream success `200`: SSE chunks with `object: text_completion` and `choices[].text`.
- Error cases: same family as chat completions + validation error when prompt list has >1 item.
- Side effects: same quota + usage recording path as chat completions.

#### 11.8.3 `POST /v1/responses` (also `/responses`)

- Purpose: OpenAI Responses API compatibility wrapper over chat backend.
- Auth/permission: `chat:write`, `EXPENSIVE`.
- Body highlights:
  - `input` supports string, message-like dict, or list of strings/items.
  - `instructions` prepended as system message.
  - `max_output_tokens` mapped to chat `max_completion_tokens`.
  - only select extra keys passthrough (`response_format`, `reasoning`, `parallel_tool_calls`, `truncation`).
- Request example:

```json
{
  "model": "gpt-5.4-mini",
  "input": "Summarize Veyra in one sentence",
  "instructions": "Be concise",
  "stream": false,
  "max_output_tokens": 128
}
```

- Success `200` non-stream (compat payload):

```json
{
  "id": "resp_123",
  "object": "response",
  "created_at": 1714723200.0,
  "error": null,
  "incomplete_details": null,
  "instructions": "Be concise",
  "metadata": null,
  "model": "gpt-5.4-mini",
  "output": [
    {
      "id": "msg_123",
      "type": "message",
      "status": "completed",
      "role": "assistant",
      "content": [
        {
          "type": "output_text",
          "text": "Veyra is an API-first AI coding platform.",
          "annotations": []
        }
      ]
    }
  ],
  "parallel_tool_calls": false,
  "temperature": null,
  "tool_choice": "auto",
  "tools": [],
  "top_p": null,
  "max_output_tokens": 128,
  "status": "completed",
  "user": "<user_uuid>",
  "usage": {
    "input_tokens": 12,
    "input_tokens_details": {"cached_tokens": 0},
    "output_tokens": 9,
    "output_tokens_details": {"reasoning_tokens": 0},
    "total_tokens": 21
  }
}
```

- Stream success `200` SSE event sequence includes:
  - `response.created`
  - repeated `response.output_text.delta`
  - `response.output_text.done`
  - `response.completed`
  - `[DONE]`
- Error cases: same family as chat.
- Side effects: same quota + usage recording path as chat.

#### 11.8.4 `POST /v1/embeddings` (also `/embeddings`)

- Purpose: embedding generation.
- Auth/permission:
  - permission `embeddings:read`.
  - authenticated `EXPENSIVE` rate limit.
- Request example:

```json
{
  "model": "text-embedding-3-small",
  "input": "hello world",
  "encoding_format": "float"
}
```

- Success `200`:

```json
{
  "object": "list",
  "data": [
    {"object": "embedding", "embedding": [0.1, 0.2], "index": 0}
  ],
  "model": "text-embedding-3-small",
  "usage": {"prompt_tokens": 2, "completion_tokens": 0, "total_tokens": 2}
}
```

- Validation:
  - string input max length 30,000.
  - list max length 256, no empty list.
  - each item max length 30,000.
- Error cases:
  - `402 billing_required` / `403 model_not_available` via model router.
  - validation errors above.
- Side effects:
  - writes a `usage_records` row with embedding input token usage and pricing snapshot.

#### 11.8.5 `POST /v1/images/generations` (also `/images/generations`)

- Purpose: image generation.
- Auth/permission:
  - permission `images:write`.
  - authenticated `EXPENSIVE` rate limit.
- Request example:

```json
{
  "model": "gpt-image-2",
  "prompt": "A minimal geometric logo",
  "n": 1,
  "size": "1024x1024",
  "quality": "standard",
  "response_format": "url"
}
```

- Success `200`:

```json
{
  "created": 1714723200,
  "data": [
    {
      "url": "https://example.com/image.png",
      "b64_json": null,
      "revised_prompt": null
    }
  ]
}
```

- Validation:
  - `n` 1..10.
  - `size` in `1024x1024|1024x1792|1792x1024`.
  - `quality` in `standard|hd`.
- Implementation note:
  - schema accepts and forwards `response_format` when provided.
- Side effects:
  - writes a `usage_records` row with prompt token usage, image-generation metadata, and pricing snapshot.

#### 11.8.6 `POST /v1/audio/transcriptions` (also `/audio/transcriptions`)

- Purpose: audio-to-text transcription.
- Auth/permission:
  - permission `audio:write`.
  - authenticated `HEAVY` rate limit.
- Headers: `multipart/form-data`.
- Form fields:
  - `file` (required upload).
  - `model` (optional, default `whisper-1`).
  - `language` (optional).
- Success `200`:

```json
{
  "text": "transcribed text"
}
```

- Validation:
  - allowed content types from `AUDIO_ALLOWED_CONTENT_TYPES`.
  - endpoint limit: `AUDIO_MAX_SIZE_BYTES` (default 25 MB).
  - file cannot be empty.
- Important edge case:
  - global middleware request-size limit defaults to 10 MB; unless increased, requests >10 MB fail before endpoint logic even though audio endpoint allows 25 MB.
- Error cases:
  - `415 unsupported_media_type`.
  - `400 invalid_audio` empty file.
  - `413 payload_too_large`.
  - model/billing access errors from model router.
- Side effects:
  - successful provider calls write a `usage_records` row; missing token usage is retained with billing status metadata.

#### 11.8.7 `GET /v1/models` (also `/models`)

- Purpose: list models available to caller after plan + user control filtering.
- Auth/permission:
  - permission `chat:read`.
  - authenticated `AUTH` rate limit.
- Success `200`:

```json
{
  "object": "list",
  "data": [
    {"id": "gpt-5.4-mini", "object": "model", "created": 0, "owned_by": "veyra"}
  ]
}
```

- Notes:
  - if user `api_access_enabled=false`, returns empty list.

#### 11.8.8 `GET /v1/models/{model_id}` (also `/models/{model_id}`)

- Purpose: retrieve a model only if in caller's available list.
- Path params: `model_id`.
- Success `200`: `ModelInfo`.
- Error `404`:

```json
{
  "error": {
    "code": "model_not_found",
    "message": "Model 'gpt-5.4-pro' was not found"
  }
}
```

### 11.9 Assistant (`/v1/assistant/*`)

#### `POST /v1/assistant/chat`

- Purpose: Veyra in-app assistant with public and authenticated modes.
- Auth: optional session user; no mandatory auth.
- Rate limit: `PUBLIC`.
- Body:

```json
{
  "message": "Show my available models",
  "history": [
    {"role": "user", "content": "Previous question"}
  ],
  "stream": true
}
```

- Non-stream success `200` (`ProjectAssistantResponse`):

```json
{
  "answer": "### Available Models\nYour current plan: **Pro**\n\nYou can currently use:\n- `gpt-5.4-mini`",
  "model": "account-context",
  "references": ["account:model-access", "account:quota"],
  "blocked": false,
  "requires_login": false,
  "scope_limited": false
}
```

- Stream success `200` (`text/event-stream`): structured events:
  - `{"type":"meta",...}`
  - repeated `{"type":"delta","delta":"..."}`
  - `{"type":"done",...}`
  - `[DONE]`
- Policy behavior:
  - out-of-scope (non-Veyra topics) -> scope refusal (`scope_limited=true`).
  - private-account topics while logged out -> login-required response (`requires_login=true`).
  - secret-exfiltration patterns -> blocked response (`blocked=true`).
  - model-list intent is answered directly from account context without LLM call.
- Side effects/dependencies:
  - may gather quota/billing/models/workspace/usage/activity context for authenticated users.
  - may retrieve sanitized repo snippets from `PROJECT_ASSISTANT_REPO_ROOT`.
  - if provider unavailable, returns safe fallback answer.

#### `POST /v1/assistant/project-chat`

- Purpose: backward-compatible assistant route.
- Auth: session JWT + permission `chat:write`.
- Rate limit: authenticated `EXPENSIVE`.
- Behavior: delegates fully to `/v1/assistant/chat` implementation.

### 11.10 Help (`/v1/help/contact`)

#### `POST /v1/help/contact`

- Purpose: submit support contact request.
- Auth: none.
- Rate limit: `PUBLIC`.
- Body (`SupportContactRequest`) example:

```json
{
  "name": "Test User",
  "email": "test.user@veyra.ai",
  "subject": "Cannot run model request",
  "category": "api",
  "severity": "high",
  "message": "I am getting a billing_required error in playground.",
  "context_url": "https://veyra.tubox.cloud/dashboard/playground",
  "request_id": "req_123"
}
```

- Success `200`:

```json
{
  "message": "Support request received. Our team will contact you shortly.",
  "ticket_id": "VYR-20260503-AB12CD34"
}
```

- Error cases:
  - `422 validation_error` invalid input.
  - `429 rate_limited` from service-level daily caps.
- Validation/service limits:
  - severity must be one of `low|normal|high|critical`.
  - per-email/day cap: 5.
  - per-IP/day cap: 20.
- Side effects:
  - sends support email to configured support inbox (`SUPPORT_CONTACT_EMAIL`).

### 11.11 Waitlist (`/v1/waitlist`)

#### `POST /v1/waitlist`

- Purpose: public waitlist signup.
- Auth: none.
- Rate limit: `PUBLIC`.
- Body:

```json
{
  "email": "new.waitlist@veyra.ai",
  "source": "landing-download",
  "referrer_url": "https://veyra.tubox.cloud/"
}
```

- Success `200`:

```json
{
  "message": "You're on the waitlist. We'll notify you when downloads open.",
  "already_joined": false,
  "signup_id": "6d3f8f53-4a6f-4fc9-92f1-6e4be6f7639d",
  "created_at": "2026-05-03T12:34:56.000000Z"
}
```

- Idempotency behavior:
  - same email is upserted; subsequent calls return `already_joined=true` with "already on the waitlist" message.
- Side effects:
  - inserts/updates `waitlist_signups` row keyed by unique email.

### 11.12 Admin (`/v1/admin/*`)

Admin router-wide behavior:

- Base path: `/v1/admin`
- Required auth: **session JWT only** (`require_session_auth`). API keys are rejected.
- Required permission: `admin:access`.
- Router-level rate limit: authenticated `AUTH`.
- Additional role gates:
  - `AdminUserDep` (admin or super-admin): admin-account listing/profile endpoints.
  - `SuperAdminUserDep` (super-admin only): all dashboard analytics, platform operations, and destructive controls.
- Common headers:
  - `Authorization: Bearer <jwt>`
  - `Content-Type: application/json` for POST/PATCH bodies.
  - `If-None-Match` for ETag-enabled analytics endpoints.

#### 11.12.1 Admin Account Management

#### `GET /v1/admin/admin-users`

- Purpose: list admin/staff accounts with search/filter/sort.
- Auth: admin or super-admin session.
- Query params:
  - `offset` (>=0, default `0`)
  - `limit` (1..100, default `25`)
  - `search` (optional, max 120)
  - `role` (`super_admin|staff`)
  - `status` (`active|disabled`)
  - `sort_by` (`name|email|role|status|last_active|created_at`, default `last_active`)
  - `sort_dir` (`asc|desc`, default `desc`)
- Example request:

```http
GET /v1/admin/admin-users?offset=0&limit=25&search=ops&role=staff&status=active&sort_by=name&sort_dir=asc
Authorization: Bearer <super_admin_jwt>
```

- Success `200`:

```json
{
  "items": [
    {
      "id": "1f5b8b91-2d40-4a64-b2cc-c6f938cdd81d",
      "name": "ops-lead",
      "email": "ops-lead@veyra.ai",
      "role": "staff",
      "status": "active",
      "last_active": "2026-05-03T10:10:00Z",
      "created_at": "2026-05-01T08:00:00Z",
      "is_current_user": false
    }
  ],
  "total": 1,
  "offset": 0,
  "limit": 25,
  "has_more": false
}
```

- Error cases:
  - `403 permission_denied` (non-admin caller).
- Side effects: none.
- Dependencies: `admin_service.list_admin_accounts`, `users` table.

#### `GET /v1/admin/admin-users/me`

- Purpose: current admin profile with effective permissions.
- Auth: admin or super-admin session.
- Success `200`:

```json
{
  "account": {
    "id": "7e4fd86e-f4ef-4d80-a89f-b4b958f75acb",
    "name": "root-admin",
    "email": "admin@veyra.ai",
    "role": "super_admin",
    "status": "active",
    "last_active": "2026-05-03T11:11:11Z",
    "created_at": "2026-04-01T00:00:00Z",
    "is_current_user": true
  },
  "permissions": [
    "admin:access",
    "api_keys:manage",
    "billing:read",
    "chat:read",
    "chat:write",
    "conversations:read",
    "conversations:write",
    "embeddings:read",
    "images:write",
    "models:manage",
    "quota:manage",
    "quota:read",
    "users:manage",
    "users:read"
  ],
  "failed_login_attempts": 0,
  "locked_until": null,
  "last_login_ip": "203.0.113.10"
}
```

- Side effects: none.

#### `GET /v1/admin/admin-users/activity-logs`

- Purpose: audit trail for admin-account lifecycle actions (`admin.account.*`).
- Auth: super-admin session only.
- Query params:
  - `offset` (>=0, default `0`)
  - `limit` (1..200, default `50`)
  - `search` (optional, max 120)
  - `severity` (`info|warning|error|critical`)
- Success `200`:

```json
{
  "items": [
    {
      "id": 919,
      "user_id": "7e4fd86e-f4ef-4d80-a89f-b4b958f75acb",
      "user_email": "admin@veyra.ai",
      "user_username": "root-admin",
      "action": "admin.account.created",
      "resource": "admin_user",
      "resource_id": "1f5b8b91-2d40-4a64-b2cc-c6f938cdd81d",
      "severity": "warning",
      "details": {
        "target_email": "ops-lead@veyra.ai",
        "target_role": "staff"
      },
      "ip_address": "203.0.113.10",
      "request_id": "req_admin_123",
      "created_at": "2026-05-03T10:00:00Z"
    }
  ],
  "total": 1,
  "offset": 0,
  "limit": 50,
  "has_more": false
}
```

- Error cases:
  - `403 permission_denied` (staff admin/non-admin).

#### `GET /v1/admin/admin-users/{account_id}`

- Purpose: fetch one admin account profile.
- Auth:
  - super-admin can fetch any admin account.
  - staff admin can fetch **only self**.
- Path param: `account_id` (UUID).
- Success `200`: same shape as `/v1/admin/admin-users/me`.
- Error cases:
  - `403 permission_denied` (staff accessing another admin profile).
  - `404 not_found` (target missing/non-admin/deleted).

#### `POST /v1/admin/admin-users`

- Purpose: create new staff or super-admin account.
- Auth: super-admin only.
- Body (`AdminManagementCreateRequest`):
  - `name` (3..64)
  - `email` (valid email)
  - `password` (8..256 + password policy checks)
  - `role` (`staff|super_admin`, default `staff`)
  - `is_active` (default `true`)
- Request example:

```json
{
  "name": "ops-lead",
  "email": "ops-lead@veyra.ai",
  "password": "OpsLeadPass123!@#",
  "role": "staff",
  "is_active": true
}
```

- Success `200`: `AdminManagementProfileResponse` (same shape as `/admin-users/me`).
- Error cases:
  - `403 permission_denied`.
  - `409 conflict` duplicate email.
  - `422 validation_error` invalid email/password/name.
- Side effects:
  - creates `users` row with:
    - `role=admin` + `is_superuser=false` for `staff`.
    - `role=superuser` + `is_superuser=true` for `super_admin`.
  - username auto-derived and made unique.
  - writes audit log `admin.account.created` (`severity=warning`).
  - invalidates admin dashboard caches.

#### `PATCH /v1/admin/admin-users/{account_id}`

- Purpose: update admin role/status.
- Auth: super-admin only.
- Path param: `account_id` (UUID).
- Body (`AdminManagementUpdateRequest`):
  - `role` (`staff|super_admin`) optional
  - `is_active` optional
- Request example:

```json
{
  "role": "super_admin",
  "is_active": true
}
```

- Success `200`: `AdminManagementProfileResponse`.
- Error cases:
  - `403 permission_denied`.
  - `404 not_found`.
  - `422 validation_error`:
    - self-demotion blocked.
    - primary bootstrap super-admin cannot be demoted/disabled.
- Side effects:
  - updates target user role/status fields.
  - writes audit log `admin.account.updated`.
  - invalidates admin dashboard caches.

#### `DELETE /v1/admin/admin-users/{account_id}`

- Purpose: remove admin account (soft-delete + revoke access artifacts).
- Auth: super-admin only.
- Path param: `account_id` (UUID).
- Success `200`:

```json
{
  "message": "Admin account deleted",
  "affected_count": 1
}
```

- Error cases:
  - `403 permission_denied`.
  - `404 not_found`.
  - `422 validation_error`:
    - self-delete blocked.
    - primary bootstrap super-admin cannot be deleted.
- Side effects:
  - revokes all sessions for target account.
  - revokes all active API keys for target account.
  - soft-deletes user (`deleted_at` set).
  - writes audit log `admin.account.deleted` (`severity=critical`).
  - invalidates admin dashboard caches.

#### 11.12.2 Admin Dashboard Metrics

#### `GET /v1/admin/overview`

- Purpose: system-wide KPI summary for admin dashboard.
- Auth: super-admin only.
- Query/body: none.
- Caching:
  - Redis key `admin:overview:v1` (+ stale/lock helpers).
  - response includes `ETag`.
  - `If-None-Match` may return `304`.
  - private cache headers from `ADMIN_OVERVIEW_CACHE_TTL_SECONDS`.
- Success `200`:

```json
{
  "total_users": 1024,
  "active_users": 998,
  "verified_users": 950,
  "admin_users": 4,
  "locked_users": 2,
  "totp_enabled_users": 210,
  "users_with_billing": 640,
  "new_users_24h": 17,
  "total_requests_24h": 5421,
  "total_tokens_24h": 9832210,
  "failed_requests_24h": 85,
  "active_api_keys": 303,
  "plan_distribution": [
    { "plan": "free", "users": 400 },
    { "plan": "pro", "users": 500 },
    { "plan": "team", "users": 124 }
  ],
  "top_models_24h": [
    { "model": "gpt-5.4-mini", "requests": 4200, "tokens": 7100000 },
    { "model": "gpt-5.4", "requests": 900, "tokens": 2600000 }
  ]
}
```

- Success `304`: when `If-None-Match` matches computed ETag.
- Error cases: `403 permission_denied`.
- Dependencies: `usage_records`, `users`, `api_keys`, `billing_profiles`, `quota_plans`, `user_quotas`, Redis cache.

#### `GET /v1/admin/stats`

- Purpose: backward-compatible alias for `/v1/admin/overview`.
- Auth/cache/headers/success/errors: identical to `/v1/admin/overview`.

#### `GET /v1/admin/analytics`

- Purpose: time-series and operational analytics for charts.
- Auth: super-admin only.
- Query params:
  - `days` (7..90, default `14`)
- Caching:
  - Redis key `admin:analytics:v1:<days>`.
  - ETag + conditional `304`.
  - private cache headers from `ADMIN_ANALYTICS_CACHE_TTL_SECONDS`.
- Success `200`:

```json
{
  "generated_at": "2026-05-03T12:00:00Z",
  "window_days": 14,
  "usage_series": [
    { "day": "2026-04-20", "requests": 320, "tokens": 530000, "failed_requests": 8 }
  ],
  "signup_series": [
    { "day": "2026-04-20", "users": 11 }
  ],
  "active_users_series": [
    { "day": "2026-04-20", "active_users": 79 }
  ],
  "status_breakdown_24h": {
    "ok": 5000,
    "client_error": 300,
    "server_error": 45,
    "pending": 0
  },
  "plan_usage_24h": [
    { "plan": "pro", "requests": 2600, "tokens": 4200000 }
  ],
  "endpoint_breakdown_24h": [
    { "endpoint": "chat", "requests": 4700, "tokens": 9000000 }
  ],
  "error_models_24h": [
    {
      "model": "gpt-5.4-mini",
      "failed_requests": 40,
      "total_requests": 4200,
      "failure_rate": 0.95
    }
  ],
  "top_users_24h": [
    {
      "user_id": "87f6ff53-0200-4815-b31f-2738b57cb75a",
      "email": "high-usage@veyra.ai",
      "username": "highusage",
      "requests": 120,
      "tokens": 450000,
      "failed_requests": 3
    }
  ],
  "active_sessions": 812,
  "revoked_sessions": 1200
}
```

- Success `304`: ETag match.
- Error cases: `403 permission_denied`.

#### 11.12.3 Admin User Operations

#### `GET /v1/admin/users`

- Purpose: list platform users with plan/quota/billing/API-key summary.
- Auth: super-admin only.
- Query params:
  - `offset` (>=0, default `0`)
  - `limit` (1..100, default `25`)
  - `search` (optional, max 120)
  - `role` (`user|pro|team|enterprise|admin|superuser`)
  - `is_active` (bool optional)
  - `plan_name` (optional, max 64)
- Success `200`:

```json
{
  "users": [
    {
      "id": "87f6ff53-0200-4815-b31f-2738b57cb75a",
      "email": "user@veyra.ai",
      "username": "user",
      "role": "pro",
      "is_active": true,
      "is_verified": true,
      "is_superuser": false,
      "totp_enabled": false,
      "created_at": "2026-04-01T00:00:00Z",
      "last_login_at": "2026-05-03T09:00:00Z",
      "last_login_ip": "198.51.100.22",
      "failed_login_attempts": 0,
      "locked_until": null,
      "plan_name": "pro",
      "has_billing_profile": true,
      "active_api_keys": 2,
      "tokens_used_today": 1240,
      "requests_used_today": 20,
      "tokens_used_month": 41120,
      "requests_used_month": 580,
      "custom_daily_tokens": null,
      "custom_daily_reqs": null
    }
  ],
  "total": 1,
  "offset": 0,
  "limit": 25,
  "has_more": false
}
```

- Error cases: `403 permission_denied`.

#### `GET /v1/admin/users/{user_id}`

- Purpose: detailed investigative view for one user.
- Auth: super-admin only.
- Path param: `user_id` (UUID).
- Success `200`:

```json
{
  "user": {
    "id": "87f6ff53-0200-4815-b31f-2738b57cb75a",
    "email": "user@veyra.ai",
    "username": "user",
    "role": "pro",
    "is_active": true,
    "is_verified": true,
    "is_superuser": false,
    "totp_enabled": false,
    "created_at": "2026-04-01T00:00:00Z",
    "last_login_at": "2026-05-03T09:00:00Z",
    "last_login_ip": "198.51.100.22",
    "failed_login_attempts": 0,
    "locked_until": null,
    "plan_name": "pro",
    "has_billing_profile": true,
    "active_api_keys": 2,
    "tokens_used_today": 1240,
    "requests_used_today": 20,
    "tokens_used_month": 41120,
    "requests_used_month": 580,
    "custom_daily_tokens": null,
    "custom_daily_reqs": null
  },
  "quota": {
    "plan_name": "pro",
    "daily_token_limit": 200000,
    "daily_request_limit": 500,
    "rpm_limit": 60,
    "tpm_limit": 80000,
    "max_context_tokens": 128000,
    "max_output_tokens": 8192,
    "custom_daily_tokens": null,
    "custom_daily_reqs": null,
    "tokens_used_today": 1240,
    "requests_used_today": 20,
    "tokens_used_month": 41120,
    "requests_used_month": 580,
    "tokens_used_total": 420000,
    "requests_used_total": 6200,
    "last_daily_reset": "2026-05-03",
    "last_monthly_reset": "2026-05-01"
  },
  "billing_profile": {
    "billing_email": "billing@veyra.ai",
    "full_name": "User Name",
    "company_name": null,
    "country_code": "US",
    "city": "Austin",
    "state_region": "TX",
    "postal_code": "78701",
    "tax_id": null,
    "card_brand": "visa",
    "card_last4": "4242",
    "updated_at": "2026-04-29T11:00:00Z"
  },
  "recent_usage": [
    {
      "id": "6b2233f6-4550-4434-8396-a5fb9b6ea838",
      "user_id": "87f6ff53-0200-4815-b31f-2738b57cb75a",
      "user_email": "user@veyra.ai",
      "user_username": "user",
      "model": "gpt-5.4-mini",
      "endpoint": "chat",
      "prompt_tokens": 100,
      "completion_tokens": 25,
      "total_tokens": 125,
      "latency_ms": 320,
      "status_code": 200,
      "error_code": null,
      "request_id": "req_usage_1",
      "ip_address": "198.51.100.22",
      "created_at": "2026-05-03T09:10:00Z"
    }
  ],
  "api_keys": [
    {
      "id": "f35f0ef4-cd58-4d11-a374-f10f5a6a56e9",
      "user_id": "87f6ff53-0200-4815-b31f-2738b57cb75a",
      "user_email": "user@veyra.ai",
      "user_username": "user",
      "name": "automation-key",
      "key_prefix": "veyra_sk_ab",
      "scopes": ["chat:read", "chat:write"],
      "rate_limit_override": null,
      "ip_whitelist": null,
      "usage_count": 42,
      "last_used_at": "2026-05-03T08:00:00Z",
      "expires_at": null,
      "is_active": true,
      "created_at": "2026-04-10T00:00:00Z"
    }
  ]
}
```

- Error cases:
  - `404 not_found` unknown/deleted user.
  - `403 permission_denied`.

#### `PATCH /v1/admin/users/{user_id}`

- Purpose: patch role/status flags on a user.
- Auth: super-admin only.
- Body (`AdminUserUpdate`):
  - `role`: `user|pro|team|enterprise|admin|superuser`
  - `is_active`: bool
  - `is_verified`: bool
  - `is_superuser`: bool
- Request example:

```json
{
  "role": "pro",
  "is_active": true,
  "is_verified": true,
  "is_superuser": false
}
```

- Success `200`: returns updated `AdminUserListItem` (same object shape as rows in `GET /v1/admin/users`).
- Error cases:
  - `404 not_found`.
  - `403 permission_denied`.
- Side effects:
  - invalidates admin dashboard caches.

#### `PATCH /v1/admin/users/{user_id}/quota`

- Purpose: set plan + custom quota overrides and optionally reset counters.
- Auth: super-admin only.
- Body (`AdminUserQuotaUpdate`):
  - `plan_name` (optional)
  - `custom_daily_tokens` (optional, >=0)
  - `custom_daily_reqs` (optional, >=0)
  - `reset_counters` (default `false`)
- Request example:

```json
{
  "plan_name": "pro",
  "custom_daily_tokens": 123456,
  "custom_daily_reqs": 321,
  "reset_counters": true
}
```

- Success `200` (`AdminUserQuotaSnapshot`):

```json
{
  "plan_name": "pro",
  "daily_token_limit": 123456,
  "daily_request_limit": 321,
  "rpm_limit": 60,
  "tpm_limit": 80000,
  "max_context_tokens": 128000,
  "max_output_tokens": 8192,
  "custom_daily_tokens": 123456,
  "custom_daily_reqs": 321,
  "tokens_used_today": 0,
  "requests_used_today": 0,
  "tokens_used_month": 0,
  "requests_used_month": 0,
  "tokens_used_total": 420000,
  "requests_used_total": 6200,
  "last_daily_reset": "2026-05-03",
  "last_monthly_reset": "2026-05-03"
}
```

- Error cases:
  - `404 not_found` user/plan not found.
  - `422 validation_error` invalid values.
  - `403 permission_denied`.
- Side effects:
  - updates/creates `user_quotas`.
  - if `reset_counters=true`, zeroes daily/monthly counters.
  - clears `user_plan:{user_id}` cache key.
  - invalidates admin dashboard caches.

#### `POST /v1/admin/users/{user_id}/quota`

- Purpose: backward-compatible alias for PATCH quota update.
- Auth/body/response/errors/side-effects: identical to `PATCH /v1/admin/users/{user_id}/quota`.

#### `POST /v1/admin/users/{user_id}/revoke-sessions`

- Purpose: emergency revoke all user sessions.
- Auth: super-admin only.
- Success `200`:

```json
{
  "message": "User sessions revoked",
  "affected_count": 3
}
```

- Error cases: `404 not_found`, `403 permission_denied`.
- Side effects:
  - marks all active sessions revoked.
  - invalidates admin dashboard caches.

#### `POST /v1/admin/users/{user_id}/revoke-api-keys`

- Purpose: revoke all active API keys for a user.
- Auth: super-admin only.
- Success `200`:

```json
{
  "message": "User API keys revoked",
  "affected_count": 2
}
```

- Error cases: `404 not_found`, `403 permission_denied`.
- Side effects:
  - iterates and revokes active keys.
  - invalidates admin dashboard caches.

#### `POST /v1/admin/users/{user_id}/unlock-account`

- Purpose: clear lockout/failed-login state.
- Auth: super-admin only.
- Success `200`:

```json
{
  "message": "Account lockout cleared",
  "affected_count": 1
}
```

or when already unlocked:

```json
{
  "message": "Account already unlocked",
  "affected_count": 0
}
```

- Side effects:
  - sets `failed_login_attempts=0`, `locked_until=null`.
  - invalidates admin dashboard caches.

#### `POST /v1/admin/users/{user_id}/disable-2fa`

- Purpose: force-disable TOTP for support/recovery.
- Auth: super-admin only.
- Success `200`:

```json
{
  "message": "Two-factor authentication disabled",
  "affected_count": 1
}
```

or if already disabled:

```json
{
  "message": "Two-factor already disabled",
  "affected_count": 0
}
```

- Side effects:
  - clears `totp_enabled` and `totp_secret`.
  - invalidates admin dashboard caches.

#### 11.12.4 Platform Investigations

#### `GET /v1/admin/usage`

- Purpose: paginated platform-wide usage records.
- Auth: super-admin only.
- Query params:
  - `offset` (>=0, default `0`)
  - `limit` (1..200, default `50`)
  - `search` (optional, max 120)
  - `user_id` (UUID optional)
  - `status_code` (100..599 optional)
  - `status_family` (`2xx|4xx|5xx` optional)
- Success `200`:

```json
{
  "items": [
    {
      "id": "6b2233f6-4550-4434-8396-a5fb9b6ea838",
      "user_id": "87f6ff53-0200-4815-b31f-2738b57cb75a",
      "user_email": "user@veyra.ai",
      "user_username": "user",
      "model": "gpt-5.4-mini",
      "endpoint": "chat",
      "prompt_tokens": 100,
      "completion_tokens": 25,
      "total_tokens": 125,
      "latency_ms": 320,
      "status_code": 200,
      "error_code": null,
      "request_id": "req_usage_1",
      "ip_address": "198.51.100.22",
      "created_at": "2026-05-03T09:10:00Z"
    }
  ],
  "total": 1,
  "offset": 0,
  "limit": 50,
  "has_more": false
}
```

- Error cases: `403 permission_denied`.

#### `GET /v1/admin/audit-logs`

- Purpose: paginated security/audit events.
- Auth: super-admin only.
- Query params:
  - `offset` (>=0, default `0`)
  - `limit` (1..200, default `50`)
  - `search` (optional, max 120)
  - `user_id` (UUID optional)
  - `severity` (`info|warning|error|critical`)
  - `action` (substring match, max 128)
- Success `200`:

```json
{
  "items": [
    {
      "id": 1001,
      "user_id": "87f6ff53-0200-4815-b31f-2738b57cb75a",
      "user_email": "user@veyra.ai",
      "user_username": "user",
      "action": "security.login.failed",
      "resource": "auth",
      "resource_id": "87f6ff53-0200-4815-b31f-2738b57cb75a",
      "severity": "warning",
      "details": {
        "message": "Too many attempts"
      },
      "ip_address": null,
      "request_id": "audit-test-1",
      "created_at": "2026-05-03T09:40:00Z"
    }
  ],
  "total": 1,
  "offset": 0,
  "limit": 50,
  "has_more": false
}
```

- Error cases: `403 permission_denied`.

#### `GET /v1/admin/api-keys`

- Purpose: paginated API key inventory across users.
- Auth: super-admin only.
- Query params:
  - `offset` (>=0, default `0`)
  - `limit` (1..200, default `50`)
  - `search` (optional, max 120)
  - `user_id` (UUID optional)
  - `is_active` (bool optional)
- Success `200`:

```json
{
  "keys": [
    {
      "id": "f35f0ef4-cd58-4d11-a374-f10f5a6a56e9",
      "user_id": "87f6ff53-0200-4815-b31f-2738b57cb75a",
      "user_email": "user@veyra.ai",
      "user_username": "user",
      "name": "automation-key",
      "key_prefix": "veyra_sk_ab",
      "scopes": ["chat:read", "chat:write"],
      "rate_limit_override": null,
      "ip_whitelist": null,
      "usage_count": 42,
      "last_used_at": "2026-05-03T08:00:00Z",
      "expires_at": null,
      "is_active": true,
      "created_at": "2026-04-10T00:00:00Z"
    }
  ],
  "total": 1,
  "offset": 0,
  "limit": 50,
  "has_more": false
}
```

- Error cases: `403 permission_denied`.

#### `POST /v1/admin/api-keys/{key_id}/revoke`

- Purpose: revoke one API key by ID.
- Auth: super-admin only.
- Path param: `key_id` (UUID).
- Success `200`:

```json
{
  "message": "API key revoked"
}
```

or:

```json
{
  "message": "API key is already revoked"
}
```

- Error cases:
  - `404 not_found` unknown key.
  - `403 permission_denied`.
- Side effects:
  - sets `is_active=false` and `revoked_at`.
  - invalidates admin dashboard caches.

#### `DELETE /v1/admin/api-keys/{key_id}`

- Purpose: backward-compatible alias for revoke-by-ID.
- Auth/params/response/errors/side-effects: identical to `POST /v1/admin/api-keys/{key_id}/revoke`.

---

## 12. Canonical Route and Alias Map

### 12.1 OpenAI-Compatible Dual Mounts

All of the following are mounted at both root and `/v1`:

- `POST /chat/completions` <-> `POST /v1/chat/completions`
- `POST /completions` <-> `POST /v1/completions`
- `POST /responses` <-> `POST /v1/responses`
- `POST /embeddings` <-> `POST /v1/embeddings`
- `POST /images/generations` <-> `POST /v1/images/generations`
- `POST /audio/transcriptions` <-> `POST /v1/audio/transcriptions`
- `GET /models` <-> `GET /v1/models`
- `GET /models/{model_id}` <-> `GET /v1/models/{model_id}`

### 12.2 Non-v1 Root-Only Routes

- `GET /health`
- `GET /health/ready`
- `GET /auth/google/callback`

### 12.3 Compatibility Aliases Inside `/v1`

- `GET /v1/admin/stats` -> same implementation as `GET /v1/admin/overview`.
- `POST /v1/admin/users/{user_id}/quota` -> same implementation as `PATCH /v1/admin/users/{user_id}/quota`.
- `DELETE /v1/admin/api-keys/{key_id}` -> same implementation as `POST /v1/admin/api-keys/{key_id}/revoke`.

### 12.4 Middleware Path-Rewrite Aliases (SDK Misconfiguration Recovery)

`OpenAIPathCompatibilityMiddleware` rewrites duplicated endpoint paths, including:

- `/v1/chat/completions/chat/completions` -> `/v1/chat/completions`
- `/chat/completions/chat/completions` -> `/chat/completions`
- `/v1/completions/completions` -> `/v1/completions`
- `/v1/responses/responses` -> `/v1/responses`
- `/v1/embeddings/embeddings` -> `/v1/embeddings`
- `/v1/models/models` -> `/v1/models`
- `/v1/images/generations/images/generations` -> `/v1/images/generations`
- `/v1/audio/transcriptions/audio/transcriptions` -> `/v1/audio/transcriptions`

---

## 13. Complete Endpoint Matrix

### 13.1 Root Routes

- `GET /health`
- `GET /health/ready`
- `GET /auth/google/callback`
- `POST /chat/completions`
- `POST /completions`
- `POST /responses`
- `POST /embeddings`
- `POST /images/generations`
- `POST /audio/transcriptions`
- `GET /models`
- `GET /models/{model_id}`

### 13.2 `/v1` Routes

- Auth:
  - `POST /v1/auth/register`
  - `POST /v1/auth/login`
  - `POST /v1/auth/verify-2fa`
  - `POST /v1/auth/oauth/google`
  - `POST /v1/auth/refresh`
  - `POST /v1/auth/logout`
  - `POST /v1/auth/verify-email`
  - `POST /v1/auth/request-email-verification`
  - `POST /v1/auth/password-reset/request`
  - `POST /v1/auth/password-reset/confirm`
  - `POST /v1/auth/2fa/setup`
  - `POST /v1/auth/2fa/enable`
  - `POST /v1/auth/2fa/disable`
  - `POST /v1/auth/change-password`
  - `GET /v1/auth/sessions`
  - `DELETE /v1/auth/sessions/{session_id}`
- Users:
  - `GET /v1/users/me`
  - `PATCH /v1/users/me`
  - `POST /v1/users/me/avatar`
  - `GET /v1/users/me/avatar`
  - `DELETE /v1/users/me/avatar`
  - `GET /v1/users/me/notifications`
  - `PUT /v1/users/me/notifications`
  - `GET /v1/users/me/activity`
  - `GET /v1/users/me/api-controls`
  - `PUT /v1/users/me/api-controls`
  - `GET /v1/users`
  - `PATCH /v1/users/{user_id}`
- Team:
  - `GET /v1/team/workspace`
  - `GET /v1/team/members`
  - `PATCH /v1/team/members/{member_id}`
  - `DELETE /v1/team/members/{member_id}`
  - `GET /v1/team/invites`
  - `POST /v1/team/invites`
  - `POST /v1/team/invites/{invitation_id}/resend`
  - `DELETE /v1/team/invites/{invitation_id}`
  - `POST /v1/team/invites/accept`
  - `GET /v1/team/collaboration/activity`
- API keys:
  - `POST /v1/api-keys`
  - `GET /v1/api-keys`
  - `PATCH /v1/api-keys/{key_id}`
  - `DELETE /v1/api-keys/{key_id}`
- Quota:
  - `GET /v1/quota/status`
  - `GET /v1/quota/plans`
  - `GET /v1/quota/plans/public`
- Billing:
  - `GET /v1/billing/usage`
  - `GET /v1/billing/usage/summary/daily`
  - `GET /v1/billing/usage/summary/monthly`
  - `GET /v1/billing/profile`
  - `PUT /v1/billing/profile`
  - `GET /v1/billing/access`
- OpenAI-compatible:
  - `POST /v1/chat/completions`
  - `POST /v1/completions`
  - `POST /v1/responses`
  - `POST /v1/embeddings`
  - `POST /v1/images/generations`
  - `POST /v1/audio/transcriptions`
  - `GET /v1/models`
  - `GET /v1/models/{model_id}`
- Assistant:
  - `POST /v1/assistant/chat`
  - `POST /v1/assistant/project-chat`
- Help:
  - `POST /v1/help/contact`
- Waitlist:
  - `POST /v1/waitlist`
- Admin:
  - `GET /v1/admin/admin-users`
  - `GET /v1/admin/admin-users/me`
  - `GET /v1/admin/admin-users/activity-logs`
  - `GET /v1/admin/admin-users/{account_id}`
  - `POST /v1/admin/admin-users`
  - `PATCH /v1/admin/admin-users/{account_id}`
  - `DELETE /v1/admin/admin-users/{account_id}`
  - `GET /v1/admin/overview`
  - `GET /v1/admin/stats`
  - `GET /v1/admin/analytics`
  - `GET /v1/admin/users`
  - `GET /v1/admin/users/{user_id}`
  - `PATCH /v1/admin/users/{user_id}`
  - `PATCH /v1/admin/users/{user_id}/quota`
  - `POST /v1/admin/users/{user_id}/quota`
  - `POST /v1/admin/users/{user_id}/revoke-sessions`
  - `POST /v1/admin/users/{user_id}/revoke-api-keys`
  - `POST /v1/admin/users/{user_id}/unlock-account`
  - `POST /v1/admin/users/{user_id}/disable-2fa`
  - `GET /v1/admin/usage`
  - `GET /v1/admin/audit-logs`
  - `GET /v1/admin/api-keys`
  - `POST /v1/admin/api-keys/{key_id}/revoke`
  - `DELETE /v1/admin/api-keys/{key_id}`

---

## 14. Environment Variables (Implementation Catalog)

All environment loading is defined in `app/config.py` (`Settings` model, `env_file=.env`).

### 14.1 Minimum Practical Variables for Production

- `SECRET_KEY` (required and >=32 chars in production).
- `DATABASE_URL`
- `REDIS_URL`
- `AZURE_OPENAI_ENDPOINT`
- `AZURE_OPENAI_API_KEY`
- `AZURE_FOUNDRY_DEPLOYMENTS`
- `ALLOWED_HOSTS`
- `CORS_ORIGINS`
- `PRODUCTION_APP_URL`

Commonly required depending on feature flags:

- Google OAuth: `ENABLE_GOOGLE_OAUTH`, `GOOGLE_OAUTH_CLIENT_ID`, `GOOGLE_OAUTH_CLIENT_SECRET`, `GOOGLE_OAUTH_REDIRECT_URI`
- SMTP delivery: `EMAIL_BACKEND`, `EMAIL_HOST`, `EMAIL_PORT`, `EMAIL_HOST_USER`, `EMAIL_HOST_PASSWORD`, `DEFAULT_FROM_EMAIL`
- Admin bootstrap: `BOOTSTRAP_ADMIN_ENABLED`, `BOOTSTRAP_ADMIN_USERNAME`, `BOOTSTRAP_ADMIN_EMAIL`, `BOOTSTRAP_ADMIN_PASSWORD`

### 14.2 Full Settings Key List (Loaded from Environment)

```text
APP_NAME
APP_ENV
APP_VERSION
DEBUG
SECRET_KEY
FRONTEND_URL
PRODUCTION_APP_URL
BOOTSTRAP_ADMIN_ENABLED
BOOTSTRAP_ADMIN_USERNAME
BOOTSTRAP_ADMIN_EMAIL
BOOTSTRAP_ADMIN_PASSWORD
HOST
PORT
WORKERS
ALLOWED_HOSTS
CORS_ORIGINS
CORS_ALLOW_METHODS
CORS_ALLOW_HEADERS
CORS_EXPOSE_HEADERS
TRUSTED_PROXY_IPS
JWT_PRIVATE_KEY_PATH
JWT_PUBLIC_KEY_PATH
JWT_ACCESS_TOKEN_EXPIRE_MINUTES
JWT_REFRESH_TOKEN_EXPIRE_DAYS
JWT_ALGORITHM
DATABASE_URL
DATABASE_POOL_SIZE
DATABASE_MAX_OVERFLOW
DATABASE_POOL_TIMEOUT
DATABASE_POOL_PRE_PING
SQL_ECHO
ADMIN_OVERVIEW_CACHE_TTL_SECONDS
ADMIN_ANALYTICS_CACHE_TTL_SECONDS
USER_DASHBOARD_CACHE_TTL_SECONDS
REDIS_URL
REDIS_MAX_CONNECTIONS
CELERY_BROKER_URL
CELERY_RESULT_BACKEND
AZURE_OPENAI_ENDPOINT
AZURE_OPENAI_API_VERSION
AZURE_OPENAI_API_KEY
AZURE_FOUNDARY_DEPLOYMENT
AZURE_FOUNDRY_DEPLOYMENTS
AZURE_CLIENT_ID
AZURE_TENANT_ID
AZURE_KEY_VAULT_URL
SMTP_HOST
SMTP_PORT
SMTP_USER
SMTP_PASSWORD
EMAIL_FROM
EMAIL_FROM_NAME
EMAIL_BACKEND
EMAIL_HOST
EMAIL_PORT
EMAIL_USE_TLS
EMAIL_HOST_USER
EMAIL_HOST_PASSWORD
DEFAULT_FROM_EMAIL
SUPPORT_CONTACT_EMAIL
ENABLE_GOOGLE_OAUTH
GOOGLE_OAUTH_CLIENT_ID
GOOGLE_OAUTH_CLIENT_SECRET
GOOGLE_OAUTH_REDIRECT_URI
MAX_REQUEST_BODY_SIZE_BYTES
ARGON2_TIME_COST
ARGON2_MEMORY_COST
ARGON2_PARALLELISM
ACCOUNT_LOCKOUT_THRESHOLD
ACCOUNT_LOCKOUT_BASE_MINUTES
IP_BLOCKLIST_KEY
RATE_LIMIT_ENABLED
RATE_LIMIT_PUBLIC_BURST_LIMIT
RATE_LIMIT_PUBLIC_BURST_WINDOW_SECONDS
RATE_LIMIT_PUBLIC_SUSTAINED_LIMIT
RATE_LIMIT_PUBLIC_SUSTAINED_WINDOW_SECONDS
RATE_LIMIT_AUTH_BURST_LIMIT
RATE_LIMIT_AUTH_BURST_WINDOW_SECONDS
RATE_LIMIT_AUTH_SUSTAINED_LIMIT
RATE_LIMIT_AUTH_SUSTAINED_WINDOW_SECONDS
RATE_LIMIT_AUTH_LOGIN_BURST_LIMIT
RATE_LIMIT_AUTH_LOGIN_BURST_WINDOW_SECONDS
RATE_LIMIT_AUTH_LOGIN_SUSTAINED_LIMIT
RATE_LIMIT_AUTH_LOGIN_SUSTAINED_WINDOW_SECONDS
RATE_LIMIT_EXPENSIVE_BURST_LIMIT
RATE_LIMIT_EXPENSIVE_BURST_WINDOW_SECONDS
RATE_LIMIT_EXPENSIVE_SUSTAINED_LIMIT
RATE_LIMIT_EXPENSIVE_SUSTAINED_WINDOW_SECONDS
RATE_LIMIT_HEAVY_BURST_LIMIT
RATE_LIMIT_HEAVY_BURST_WINDOW_SECONDS
RATE_LIMIT_HEAVY_SUSTAINED_LIMIT
RATE_LIMIT_HEAVY_SUSTAINED_WINDOW_SECONDS
RATE_LIMIT_IP_BLOCK_THRESHOLD
RATE_LIMIT_IP_BLOCK_WINDOW_SECONDS
RATE_LIMIT_IP_BLOCK_DURATION_SECONDS
RATE_LIMIT_IP_BLOCK_KEY_PREFIX
REFRESH_TOKEN_REUSE_GRACE_SECONDS
SESSION_FINGERPRINT_ENABLED
SESSION_FINGERPRINT_STRICT
AUTH_COOKIE_ENABLED
AUTH_COOKIE_SECURE
AUTH_COOKIE_DOMAIN
AUTH_COOKIE_PATH
AUTH_COOKIE_SAMESITE
AUTH_REFRESH_COOKIE_NAME
AUTH_CSRF_COOKIE_NAME
AUTH_CSRF_HEADER_NAME
AUTH_CSRF_TOKEN_BYTES
EMAIL_VERIFICATION_OTP_LENGTH
EMAIL_VERIFICATION_OTP_TTL_SECONDS
EMAIL_VERIFICATION_OTP_MAX_ATTEMPTS
SENTRY_DSN
OTEL_EXPORTER_OTLP_ENDPOINT
PROMETHEUS_METRICS_TOKEN
LOG_LEVEL
LOG_FORMAT
ENABLE_2FA
ENABLE_API_KEYS
ENABLE_CONVERSATION_HISTORY
ENABLE_AGENT_ENDPOINTS
ENABLE_IMAGE_GENERATION
ENABLE_AUDIO_TRANSCRIPTION
MAINTENANCE_MODE
ENABLE_PROJECT_ASSISTANT
AVATAR_STORAGE_DIR
AVATAR_MAX_SIZE_BYTES
AUDIO_MAX_SIZE_BYTES
AUDIO_ALLOWED_CONTENT_TYPES
PROJECT_ASSISTANT_REPO_ROOT
PROJECT_ASSISTANT_MAX_FILES
PROJECT_ASSISTANT_MAX_FILE_BYTES
PROJECT_ASSISTANT_MAX_CHUNKS
PROJECT_ASSISTANT_CHUNK_CHARS
PROJECT_ASSISTANT_CHUNK_OVERLAP_CHARS
PROJECT_ASSISTANT_MODEL_PREFERENCE
```

---

## 15. Important Implementation Notes and Edge Cases

- Session-only endpoints are enforced by `require_session_auth`; API keys with valid scopes still fail there.
- Cookie refresh mode (`AUTH_COOKIE_ENABLED=true`) requires CSRF header/cookie match; JSON refresh token may be empty by design.
- Strict session fingerprint mode can revoke session + JTI on mismatch during auth/refresh.
- `AUTH` rate-limit identity includes route bucket hash (`:path:<hash>`), so limits are segmented per endpoint path.
- Temporary IP block escalation excludes `AUTH` category but includes `PUBLIC`, `AUTH_LOGIN`, `EXPENSIVE`, and `HEAVY`.
- `OpenAIPathCompatibilityMiddleware` silently rewrites duplicated SDK paths; logs `openai_path_rewrite_applied`.
- Streaming endpoints emit error chunk(s) followed by `data: [DONE]`.
- `embeddings`, `images`, and `audio` enforce model access/billing and write usage records with provider usage or explicit billing-status safeguards when usage is missing.
- `ImageGenerationRequest.response_format` is accepted by schema but not passed to provider generation call.
- API key `rate_limit_override` is persisted but not consumed by rate-limit enforcement.
- Global request-size middleware defaults to 10 MB; it can block large multipart uploads before endpoint-specific limits (for example audio 25 MB) are reached.
- Admin overview/analytics endpoints use Redis caching with lock + stale fallback and ETag-based conditional responses.
- Admin mutation endpoints invalidate dashboard caches; quota updates also clear `user_plan:{user_id}`.
- Team invitation acceptance requires authenticated user email to match invite email exactly (case-insensitive).
- Team seat limits count `active_members + pending_invites`.
- Waitlist signup is upsert-by-email and intentionally idempotent.
- Google OAuth callback endpoint only redirects; it does not exchange tokens itself.
