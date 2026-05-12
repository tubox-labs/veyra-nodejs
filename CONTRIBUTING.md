# Contributing

Thanks for contributing to `veyra-nodejs`.

## Development Setup

```bash
npm ci
npm run typecheck
npm run lint
npm test
npm run build
```

## Branching

- Create feature branches from `main`.
- Keep PRs focused and small when possible.

## Coding Standards

- TypeScript strict mode only.
- Keep public API backwards compatible.
- Add tests for behavior changes.
- Update docs/examples when changing API behavior.

## Pull Requests

Before opening a PR:

```bash
npm run ci:all
```

PRs should include:

- summary of change
- testing notes
- migration notes (if applicable)

## Commit Messages

Use clear, scoped messages. Suggested format:

- `feat: ...`
- `fix: ...`
- `docs: ...`
- `chore: ...`
