---
title: "Spawning Objects"
slug: "systems/networking-multiplayer/connection-permissions"
order: 50
category: "systems"
source: "https://sbox.game/dev/doc/systems/networking-multiplayer/connection-permissions/"
---

The host can change some permissions for a specific `Connection`. The ideal place to set these permissions would be in the `OnActive` [network event.](/guides/systems/networking-multiplayer/network-events)

# Spawning Objects

You can set `Connection.CanSpawnObjects` to allow or disallow a specific connection to create their own networked objects. By default this is `true`.

# Refreshing Objects

By default only the host can send network refresh updates for networked objects. This can be changed to allow the owner of a networked object to also send these updates with `Connection.CanRefreshObjects`.