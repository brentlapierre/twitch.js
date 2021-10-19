# Twitch.js

Twitch.js is a library that allows you to easily create chat bots or interact with the Twitch API.

## Installation

### NPM
```bash
npm install @twitch.js/chat
```

### Yarn
```bash
yarn add @twitch.js/chat
```

## Example Usage

```js
import { chat } from '@twitch.js/chat';

chat.connect({
  user: process.env.CHAT_USER,
  token: process.env.CHAT_TOKEN,
  rateLimit: {
    joins: 20,
    messages: 20,
  },
});

chat.on('connect', async () => {
  await chat.joinChannel('hasanabi');
});
```

## Contributing

Pull requests are always welcome!

Before creating an issue or pull request, please ensure there isn't an existing one open.
