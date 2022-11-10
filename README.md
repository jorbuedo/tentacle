## Tentacle

This is an early implementation of tax software for cryptocurrencies. Think averge price buy, current balance, gain/loss of past transactions, etc.

Works as a desktop app with the following stack:

- Tauri as a desktop framework (alternative to electron)
- Fronted and backend written in Typescript
- Solidjs for the FE library
- Tailwind for styling
- SQLite for persistance and data querying

## Status

In active but slow development, it's a side project for personal use and checking out the stack.
Feel free to browse the code and drop a comment.
Develped on linux, but it should work on Mac and Windows. Let me know if it doesn't.

## Instructions

Make sure to follow the rust install instructions from tauri at:
https://tauri.app/v1/guides/getting-started/prerequisites

Then proceed with npm:

```
npm install
npm run package
npm run tauri dev
```

API Key is generated on the exchange website (add at least 1000 nonce).
This app only requires permission to Query Ledger Entries.
