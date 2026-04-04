---
title: "New Instance"
slug: "systems/networking-multiplayer/testing-multiplayer"
order: 48
category: "systems"
source: "https://sbox.game/dev/doc/systems/networking-multiplayer/testing-multiplayer/"
---

The number one best way to test multiplayer is to have someone join your game.. but that's obviously not always possible.

# New Instance

For this reason you can spawn another instance of the game, which will join your currently running session.

To do this, click on the network status icon in the header bar, and select `Join via new instance.`

![](https://cdn.sbox.game/doc/83bb302b-ce74-4946-9fb4-74ea2471ca0f)

A new instance of the game will appear and join your game.

# Iterating

You can continue to code on your main instance, with the game running and the other instance joined. The code changes will be mirrored to the other client. In fact, they'll be mirrored to all clients - so even if you have a friend join, their game will update.

# Reconnect

If you need to reconnect, you can do this via the `reconnect` command.

# Joining manually

You can open an instance and manually join your local editor session by running `connect local` in the console.