# TOMP Bare Server

This repository implements the TompHTTP bare server. See the specification [here](https://github.com/tomphttp/specifications/blob/master/BareServer.md).

##
In use with proxies! All you need to do is deploy this to cloudflare, get the worker url clone this [repo](https://github.com/MaxWeichers/UntitledProxy)(can be hosted static!) and put the workers url in the place bare server link

## What I did

I fixed some things from this <a href="https://github.com/tomphttp/bare-server-worker">repo</a>
## Quickstart

1. Clone this repository

```sh
git clone https://github.com/tomphttp/bare-server-worker.git
```

2. Install

```sh
npm install
```

3. Build

```sh
npm run build
```

Output will contain:

- dist/sw.js - All-in-one service worker. Automatically creates the Bare Server.
- dist/index.js - ESM library. For use in environments where scripts can be imported.
