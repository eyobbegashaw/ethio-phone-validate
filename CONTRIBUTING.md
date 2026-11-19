# Contributing to ethio-phone-validate

Thank you for your interest in improving `ethio-phone-validate`!

## Code of Conduct

Please maintain a welcoming, respectful, and constructive environment for all contributors and community members.

## Development Workflow

1. Fork and clone the repository.
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a feature branch:
   ```bash
   git checkout -b feature/your-feature-name
   ```
4. Verify tests pass:
   ```bash
   npm test
   npm run test:coverage
   ```
5. Check TypeScript types:
   ```bash
   npm run typecheck
   ```
6. Build distribution files:
   ```bash
   npm run build
   ```

## Numbering Rule Proposals

If the Ethiopian Communications Authority (ECA) or an Ethiopian operator announces new mobile prefix series:
- Provide an authoritative citation (official ECA directive, operator public notice, or ITU-T bulletin).
- Update `src/rules/prefixes.ts` and ensure associated unit tests are added in `tests/`.

## Submitting Pull Requests

- Keep PRs focused on a single change.
- Ensure all tests pass with 100% coverage.
- Write clear commit messages following Conventional Commits.
