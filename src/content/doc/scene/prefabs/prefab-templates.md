---
title: "Prefab Templates"
slug: "scene/prefabs/prefab-templates"
order: 83
category: "scene"
source: "https://sbox.game/dev/doc/scene/prefabs/prefab-templates/"
---

If you want to add your own templates to the GameObject Create menu, it's as simple as enabling "Show In Menu" on a Prefab File:

![](https://cdn.sbox.game/doc/2ca0aa88-1e0c-4dd1-9fe8-d40aa90166b8)

Now you'll see your template as one of the options in the Create menu

![](https://cdn.sbox.game/doc/129bf867-ac48-4dd8-bc2a-d8ac9d045235)

You can make it look nicer by fiddling with the other variables, and even throw it in a sub-menu:

![](https://cdn.sbox.game/doc/e779cdb7-ab15-487c-8d33-bb97aeba7220) ![](https://cdn.sbox.game/doc/6c1e7903-9fa2-4e83-b5d4-3c66226b3a69)

The final option is whether or not the prefab should be treated as a template. Templates will always break the prefab when created, otherwise the prefab reference will be maintained: