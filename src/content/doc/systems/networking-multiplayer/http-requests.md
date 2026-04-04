---
title: "HTTP Requests"
slug: "systems/networking-multiplayer/http-requests"
order: 53
category: "systems"
source: "https://sbox.game/dev/doc/systems/networking-multiplayer/http-requests/"
---

s&box provides a static [Http](https://asset.party/api/Sandbox.Http) class, this lets you easily create asynchronous HTTP requests of different methods (GET, POST, DELETE, etc…) providing JSON content and parsing JSON responses.

## Allowed URLs

You can only use `http` or`https` URLs to domains (no IP addresses), and to prevent abuse, `localhost` is permitted only on ports 80/443/8080/8443.

The command line switch `-allowlocalhttp` will let you access any local URL from the server.

## Cheat Sheet

Some common things you might want to do…

```csharp
// GET request that returns the response as a string
string response = await Http.RequestStringAsync( "https://google.com" );

// POST request of JSON content ignoring any response
await Http.RequestAsync( "https://api.facepunch.com/my/method", "POST", Http.CreateJsonContent( playerData ) );
```