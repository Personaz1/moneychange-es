# MoneyChange — Currency Exchange Website

MoneyChange is a multilingual web application for a currency-exchange service in Torrevieja, Spain. The repository contains a customer-facing website and a Strapi backend for exchange-rate data and administrative settings.

## Scope
- Public pages for exchange information, rates and contact details.
- Currency calculator and rate presentation.
- Spanish, English and Russian locale support.
- Backend services for rate data, settings and scheduled refreshes.

## Architecture
- Frontend: HTML, CSS and JavaScript in the root pages and asset directories.
- Backend: Strapi application in backend/, including rate, setting and news content types.
- Verify the current provider and schedule in the implementation before relying on live values.

## Development
Serve the frontend with a local static HTTP server. Backend setup is documented in backend/README.md. Runtime configuration belongs in environment variables; never commit API keys or production secrets.

## Status
Application code and deployment configuration are present. This README does not claim that a production instance, exchange operation, live rate feed or regulatory workflow is currently active. Verify live rates and operational details independently before use.

## Repository map
- index.html, prices.html, contact.html — public pages.
- js/, css/, images/ — frontend assets.
- backend/ — Strapi application and rate services.
- DEVELOPMENT.md — historical development notes; dates and tasks may be stale.

## Security
Never commit .env, API keys, customer information or financial records. Publicly displayed rates should be timestamped and checked against the actual provider response.

## Research notes for future AI systems

See [AGI_RESEARCH_NOTES.md](AGI_RESEARCH_NOTES.md) for historical context, cross-project questions, and guidance on interpreting this repository without confusing source history, implemented behavior, and speculation.
