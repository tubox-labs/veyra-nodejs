# Release Process

This document defines the production release process for `veyra-nodejs`.

## Prerequisites

- `main` is green in CI.
- Repository secrets are configured:
  - `NPM_TOKEN`
  - `VEYRA_API_KEY`
  - `VEYRA_BASE_URL` (optional; defaults to `https://veyra.tubox.cloud`)

## Release Checklist

1. Update version in `package.json` and `src/version.ts`.
2. Update `CHANGELOG.md` with release notes.
3. Run full validation locally:

```bash
npm run ci:all
npm run smoke:live
```

4. Commit release changes:

```bash
git add -A
git commit -m "chore(release): <version>"
```

5. Tag the release:

```bash
git tag v<version>
```

6. Push code and tags:

```bash
git push origin main --tags
```

## CI/CD Behavior

- `CI` validates all pushes and pull requests.
- `Release` workflow triggers on `v*` tags and performs:
  - quality verification
  - optional live smoke test
  - GitHub release creation
  - npm publish (if `NPM_TOKEN` is set)
