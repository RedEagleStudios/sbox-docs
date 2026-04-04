---
title: "Flowchart"
slug: "scene/components/execution-order"
order: 79
category: "scene"
source: "https://sbox.game/dev/doc/scene/components/execution-order/"
---

You should not rely on the order in which the same callback methods get invoked for different GameObjects, it is not predictable. If you need more control, you should use a [GameObjectSystem].

# Flowchart

The flow chart shows the order of execution for a Scene, component methods are executed at the same time for all components. There are some internal methods added to make context clearer.

![](https://cdn.sbox.game/doc/4fb27d42-cdca-4c18-9be5-71300c0a9558)