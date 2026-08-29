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
│   └── calculator/             # inline mode: type @botname 2+2 in any chat
│       ├── index.js            # registerCalculator(bot)
│       ├── view.js             # inline-query result articles
│       └── calculator.js       # expression evaluation logic
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
| USD (free market) | `moj3.ir/price` (HTML table, Toman) | `tgju.org` JSON (Rial ÷ 10) |
| Gold 18k/24k + Emami coin | `moj3.ir/price` (HTML table, Toman) | `tgju.org` JSON (Rial ÷ 10) |
| Bitcoin | `ramzarz.news/coins/bitcoin` (Toman) | — |

Endpoint overrides: `MOJ3_URL`, `TGJU_URL`, `RAMZARZ_URL` (full URLs).

## ⚠️ Deployed on Cloudflare Workers? Read this

moj3.ir, tgju.org and ramzarz.news are all **hosted on Iranian servers**, and
Iranian hosts commonly firewall foreign datacenter IP ranges — which is exactly
where Cloudflare Workers' outbound requests come from. Result: prices work with
`npm run dev` (Iranian IP) but every source may fail once deployed.

To confirm, watch the live logs while pressing the prices button:

```bash
npx wrangler tail
```

If you see `[market] ... HTTP 403` or `fetch failed` for the source URLs, the
sites are blocking Cloudflare's IPs — no code change can fix that. Your options:

1. **Run the bot somewhere with Iranian reachability** (a small VPS running
   `npm start` with polling instead of the Worker) — then all sources work.
2. **Route requests through any host the sites accept** (a tiny proxy is ~10
   lines of `fetch(target)` — the code supports `MOJ3_URL`/`TGJU_URL`/
   `RAMZARZ_URL` overrides, so you can point them at the proxy's URL directly).
3. Accept limited data: if moj3 + tgju are both blocked, USD/gold show ❌ too;
   sources that do answer are shown normally.

