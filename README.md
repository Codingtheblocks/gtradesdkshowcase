# gtradesdkshowcase — Gains Network SDK Showcase

This repository is a small, showcase of how to integrate the official Gains Network SDK in a React + TypeScript + Vite project.

It focuses on a single, highly reusable component: `SymbolSearch`, which demonstrates how to:

- Identify a market’s PairIndex from a symbol using the SDK’s `PairIndex` enum
- Fetch an instrument’s asset class from the SDK’s `pairs` map
- Exclude delisted instruments via `delistedPairIxs`
- Provide a production-ready search UI with asset-class filters and keyboard-friendly UX

The code here is intended as “starter code” that you can extend to fetch data from your backend, wire up charts, or drive other SDK-powered workflows.

## Live Demo

The site site will be available at:

https://codingtheblocks.github.io/gtradesdkshowcase/

## What’s Inside

- `src/components/SymbolSearch.tsx` — A self-contained search component that dynamically imports SDK constants and types:
  - `@gainsnetwork/sdk/lib/constants` → `pairs`, `delistedPairIxs`
  - `@gainsnetwork/sdk/lib/trade/types` → `PairIndex`
  - Performs symbol-to-`PairIndex` mapping (e.g., `BTC/USD` → `BTCUSD` → index)
  - Filters out delisted instruments and supports asset-class filters (crypto/forex/stocks/indices/commodities)

- `src/App.tsx` — A simple landing page that hosts the search and shows the selected symbol’s PairIndex and asset class.

- `vite.config.ts` — Configured with a `base` that toggles for GitHub Pages when `GITHUB_PAGES=true`.

- `.github/workflows/deploy.yml` — GitHub Actions workflow to build and deploy to GitHub Pages.

## License

MIT
