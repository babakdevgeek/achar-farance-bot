# achar-farance-bot

A Telegram bot (grammY) that runs locally via long polling and in production as a
Cloudflare Worker webhook.

## Structure

```
src/
├── bot.js                      # Creates the Bot, registers all features (the ONLY route map)
├── entries/
│   ├── dev.js                  # Local dev: long polling (npm run dev)
│   └── worker.js               # Production: Cloudflare Worker webhook (npm run deploy)
├── features/                   # One folder per feature — self-contained
│   ├── home/                   # /start command + main menu
│   │   ├── index.js            # registerHome(bot): routes -> handler
│   │   ├── view.js             # message text + inline keyboard
│   │   └── texts.js            # long texts kept out of view.js
│   ├── date-time/              # "current_time" button: current Persian/Gregorian date
│   │   ├── index.js            # registerDateTime(bot)
│   │   ├── view.js             # message formatting
│   │   └── date.js             # date/time logic (the "model")
│   ├── calculator/             # inline mode: type @botname 2+2 in any chat
│   │   ├── index.js            # registerCalculator(bot)
│   │   ├── view.js             # inline-query result articles
│   │   └── calculator.js       # expression evaluation logic
│   └── market/                 # prices button: USD / gold / bitcoin
│       ├── index.js            # registerMarket(bot)
│       └── view.js             # message formatting (Persian)
├── services/                   # business services used by features
│   └── market/                 # price fetching (tgju.org + tabdeal.org)
│       ├── index.js            # getMarketPrices(): cache + error isolation
│       ├── http.js             # shared JSON fetch helper (Workers-safe)
│       ├── config.js           # endpoint URLs (env-overridable)
│       ├── tgju.js / tabdeal.js          # the two source APIs
│       ├── usd.js / gold.js / bitcoin.js # per-price primary→fallback chains
│       ├── validate.js         # parsing, bounds checks, Toman conversion
│       └── cache.js            # TTL cache with stale-serving
└── shared/                     # code used by multiple features
    ├── render.js               # renderOrEdit: reply vs. editMessageText helper
    ├── emojis.js               # custom Telegram emoji ids + helpers
    └── constants.js            # parse_mode etc.
```

## How to add a new feature

1. Create a folder: `src/features/my-feature/`
2. Write your logic (`logic.js`), UI (`view.js`) and a router file (`index.js`):

```js
// src/features/my-feature/index.js
import { renderOrEdit } from "../../shared/render.js";
import { myText, myKeyboard } from "./view.js";

export function registerMyFeature(bot) {
    bot.command("myfeature", async (ctx) => {
        await renderOrEdit(ctx, myText(), myKeyboard());
    });
}
```

3. Register it in `src/bot.js` — one line:

```js
registerMyFeature(bot);
```

That's it. No other files need to be touched. If your feature needs custom
Telegram emojis, add an entry to `EMOJIS` in `src/shared/emojis.js`.

## Running

```bash
npm run dev      # local long polling (needs BOT_TOKEN in .env)
npm run deploy   # deploy to Cloudflare Workers (wrangler)
```

## Market sources

Price sources, in priority order (each source is an isolated module in
`src/services/market/`):

| Price | Primary | Fallback |
|---|---|---|
| USD (free market) | `tgju.org` JSON (Rial ÷ 10) | `tabdeal.org` USDT/IRT |
| Gold 18k/24k + Emami coin | `tgju.org` JSON (Rial ÷ 10) | `tabdeal.org` GOLD/IRT (no coin, 24k derived) |
| Bitcoin | `tgju.org` (BTC in USD × USD rate) | `tabdeal.org` BTC/IRT |

Endpoint overrides: `TGJU_URL`, `TABDEAL_URL` (full URLs).

Both sources are plain public JSON APIs and are **verified to work from a
deployed Cloudflare Worker** — no proxy or Iranian IP needed.

> ⚠️ Gotcha: the Workers runtime does not support the `cache` field on
> `fetch()` (it throws "not implemented" for older compatibility dates).
> Don't add fetch options blindly — the shared helper is `http.js`.

