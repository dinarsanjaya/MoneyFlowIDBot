# AGENTS.md

- Single-package Node.js 18+ CommonJS Telegram bot; real entrypoint is `index.js`.
- Install with `npm install`; run locally with `npm start` (`node index.js`) or `npm run dev` (`nodemon index.js`).
- There are no configured `test`, `lint`, `typecheck`, or formatter scripts. Use focused checks such as `node --check <file>` after JS edits.
- Runtime requires `.env` from `.env.example`: `TELEGRAM_BOT_TOKEN`, AI config (`AI_PROVIDER=custom` with `CUSTOM_AI_BASE_URL`/`CUSTOM_AI_MODEL`, or `AI_PROVIDER=gemini` with `GEMINI_API_KEY`), `GOOGLE_CREDENTIALS_PATH`, optional `DEFAULT_LANGUAGE`, `TIMEZONE`.
- Never commit runtime state or secrets: `.env`, `credentials/google-credentials.json`, and `data/` are intentionally gitignored. `userStore` creates `data/{userId}.json` at runtime.
- Running the bot contacts Telegram and external APIs; only use `npm start`/`npm run dev` when credentials and network access are intended.
- Bot state is split between in-memory conversation sessions in `middleware/session.js`, persisted user/profile/balances in `services/userStore.js`, and Google Sheets rows in `services/sheets.js`; transaction handlers must keep local balances and sheet writes in sync.
- `index.js` owns command routing, text-state routing, callback routing, and cron jobs; when adding a flow, update `STATES`, message handling, callback handling, keyboard `callback_data`, and locale strings together.
- Callback payload prefixes are parsed manually with `data.startsWith(...)` and `split(':')`; preserve existing prefixes or update every matching handler.
- `services/sheets.js` uses one monthly sheet named like `May 2026`; formulas assume Indonesian Google Sheets locale with `;` separators and fixed row/column positions (`R`, transaction columns `H:N`).
- Transaction cashflow labels written to Sheets are Title Case strings such as `Income`, `Spending`, `Transfer`, `Bills`, `Piutang Baru`, and `Pelunasan Utang`; report parsing maps these back to lowercase internal types.
- `services/gemini.js` is the AI adapter: custom/OpenAI-compatible calls use `CUSTOM_AI_BASE_URL` + `/chat/completions` and `CUSTOM_AI_MODEL`; Gemini remains available through `@google/generative-ai` when `AI_PROVIDER=gemini`.
- User-facing text is bilingual through `locales/id.js` and `locales/en.js`; add or change both locale files when changing bot messages.
