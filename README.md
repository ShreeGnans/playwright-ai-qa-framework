# Playwright AI QA Framework

An end-to-end e-commerce automation testing framework developed using **Playwright and TypeScript**, following the Page Object Model (POM).

## Tech Stack
- Playwright
- TypeScript
- Node.js
- Git and GitHub
- GitHub Actions

## Test Coverage
- Login validation (positive and negative scenarios)
- Inventory validation and product sorting
- Product details navigation
- Add/remove products from cart
- Cart validation and persistence
- Checkout workflow and input validation

## Framework Design
- Page Object Model
- Reusable page classes and methods
- Custom Playwright fixtures
- Assertions and locator strategies
- Automated regression scenarios

## Setup

Clone the repository:

```bash
git clone https://github.com/shreegnans/playwright-ai-qa-framework.git
```

Install dependencies:

```bash
npm install
```

Install Playwright browsers:

```bash
npx playwright install
```

Run tests:

```bash
npx playwright test --project=chromium
```

View the HTML report:

```bash
npx playwright show-report
```

## Project Status

Continuously adding and improving UI automation scenarios and framework capabilities.
