# Releasing to Production

## Required Secrets

Configure these repository secrets before release:

- `NPM_TOKEN`: npm automation token with publish access.
- `VEYRA_API_KEY`: API key used by the live smoke test.
- `VEYRA_BASE_URL` (optional): defaults to `https://veyra.tubox.cloud` when absent.

## CI Workflow

`CI` runs on pushes and pull requests and enforces:

- type checking
- linting
- tests + coverage
- build
- CJS/ESM export verification
- API docs generation

## CD Workflow

`Release` runs on tags `v*` and can also run manually.

Pipeline order:

1. `verify`: full quality gates.
2. `live_smoke`: end-to-end smoke test against production (if `VEYRA_API_KEY` is set).
3. `github_release`: creates a GitHub Release and uploads `npm pack` tarball.
4. `publish_npm`: publishes to npm with provenance when `NPM_TOKEN` is configured.

## Release Commands

```bash
npm version 1.0.0 --no-git-tag-version
npm run ci:all
git add -A
git commit -m "chore(release): 1.0.0"
git tag v1.0.0
git push origin main --tags
```
