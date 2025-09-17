# Home Chef — Menu Extractor

This repository contains a complete full-stack example:

- `server/` — Node.js + Express backend that receives a `.txt` upload, calls an LLM to extract a "Home Chef" menu in structured JSON, stores it in PostgreSQL, and returns the extracted JSON.
- `client/` — React (Vite) frontend with an upload form and a display component to show the extracted menu.

See the canvas document in the assistant chat for full code explanations. This archive contains runnable source files.

## Quick start (local)

1. Start PostgreSQL and create a database, e.g. `homechef`.
2. Server setup:
   - `cd server`
   - copy `.env.example` to `.env` and set `DATABASE_URL` and `OPENAI_API_KEY`.
   - `npm install`
   - run migrations: `psql $DATABASE_URL -f db/migrations/init.sql` or run the SQL manually.
   - `npm run dev` (requires nodemon) or `npm start`.

3. Client setup:
   - `cd client`
   - `npm install`
   - `npm run dev` (Vite default is usually http://localhost:5173)

4. Open the client in the browser, upload a `.txt` file, and the app will call the server at `http://localhost:4000/api/upload`.

## Environment variables

Set in `server/.env`:

```
PORT=4000
DATABASE_URL=postgres://user:password@localhost:5432/homechef
OPENAI_API_KEY=sk-REPLACE_ME
AI_MODEL=gpt-4o-mini
```

## Notes

- This example uses the OpenAI chat/completions endpoint via axios. Adapt `server/services/aiClient.js` if you prefer a different provider.
- The server expects the model to return strict JSON; there is small parsing fallback logic but real-world apps should add stronger validation and error-handling.

Enjoy!  If you want, I can now:
- Walk you through Step 1 (server setup) with exact shell commands and explain each file in the server,
- Or scaffold and run the server here (I can't run your local DB, but I can show how to run it),
- Or add a `GET /api/menus` endpoint and a frontend page to list previously uploaded menus.

Tell me which step you'd like to do next and I'll continue step-by-step.
