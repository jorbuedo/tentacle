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

## Instructions

```
npm run package
npm run tauri dev
```

There's no UI to add Kraken key/secret yet, but you can do so via

```
window.model.updateKrakenApiKey({ key: 'xx', secret: 'xx'})
```

Both values can be generated on the exchange website (add 1000 nonce to the key).
