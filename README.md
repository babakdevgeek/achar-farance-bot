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

## Market sources & Cloudflare Workers connectivity

Price sources, in priority order (each source is an isolated module in
`src/services/market/`):

| Price | Primary | Fallback |
|---|---|---|
| USD (free market) | `moj3.ir/price` (HTML table, Toman) | `tgju.org` JSON (Rial ÷ 10) |
| Gold 18k/24k + Emami coin | `moj3.ir/price` (HTML table, Toman) | `tgju.org` JSON (Rial ÷ 10) |
| Bitcoin | `bitpin.ir` JSON (Toman) | — |

chartix.ir was evaluated but exposes no accessible price endpoint (only a
public symbol list); isignal.ir's gateway requires app authentication.

When deployed to Cloudflare Workers, outbound requests leave from **Cloudflare
datacenter IPs**, and some Iranian sites geo-block or throttle those IPs. Local
dev (`npm run dev`) is usually unaffected.

If a source is unreachable from Workers, set these variables (wrangler vars /
`.env`) to a reachable mirror, or route through a relay:

| Variable | Purpose |
|---|---|
| `MOJ3_URL` | full URL of the moj3.ir/price page |
| `TGJU_URL` | full URL of the TGJU JSON feed |
| `BITPIN_URL` | full URL of the Bitpin markets endpoint |
| `MARKET_PROXY_URL` | optional relay base URL; each request becomes `<MARKET_PROXY_URL>?url=<encoded target>` |

A minimal relay Worker (deploy it in the same account, or anywhere with
reachable egress):

```js
export default {
    async fetch(request) {
        const target = new URL(request.url).searchParams.get("url");
        if (!target || !/^https:\/\//.test(target)) return new Response("bad request", { status: 400 });
        return fetch(target, { headers: { Accept: "application/json", "User-Agent": "Mozilla/5.0" } });
    },
};
```

