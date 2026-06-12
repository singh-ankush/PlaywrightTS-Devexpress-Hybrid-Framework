# Playwright Blazor Support

A small collection of Playwright tests, helpers and configuration for testing Blazor apps. Includes Excel utilities, cloud capability templates, and sample tests.

## Quick Start

- Install dependencies:

```bash
npm install
```

- Run the test suite:

```bash
npx playwright test
```

- Run a single test file:

```bash
npx playwright test tests/example.spec.ts
```

- Run tests in headed mode:

```bash
npx playwright test --headed
```

- View the HTML report:

```bash
npx playwright show-report
# or open the generated file: playwright-report/index.html
```

## Prerequisites

- Node.js (LTS recommended) and npm
- Playwright (installed via the project's dependencies)

## Project layout

- `playwright.config.ts` — Playwright configuration for this project.
- `tests/` — Test files (example.spec.ts, excel.spec.ts, ExcelUseTest.ts).
- `src/` — Page objects and helpers (pages/BasePage.ts, main/).
- `Utils/` — Utilities and Excel helpers (ExcelReusables.ts).
- `data_src/` — helper modules (ExcelUtil.ts).
- `capabilities/cloud/` — cloud providers (lambdatest-capabilities.ts).
- `playwright-report/` — generated HTML reports and assets.

## Excel / Data helpers

This repo includes utilities for working with Excel files used by tests. See `Utils/ExcelReusables.ts` and `data_src/ExcelUtil.ts` for reusable routines.

## Cloud / CI

There are capability templates under `capabilities/cloud/` (for LambdaTest). Adapt `playwright.config.ts` or your CI setup to use these when running tests in the cloud.

## Contributing

1. Create a branch for your change.
2. Add tests for new behavior where applicable.
3. Open a PR describing the change.

## License

This project includes a `LICENSE` file in the repository root.

---

If you'd like, I can also run the tests locally, add a sample GitHub Actions workflow, or expand the README with environment-specific setup notes. Which would you prefer next?
