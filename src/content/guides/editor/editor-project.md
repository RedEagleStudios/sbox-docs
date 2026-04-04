---
title: "Creating"
slug: "editor/editor-project"
category: "editor"
source: "https://sbox.game/dev/doc/editor/editor-project/"
---

Your game can have an editor component to it. Your game's editor project is special in that it can access both the tools and the game code.

Editor projects are not sandboxed. They are not limited by any whitelists and can run any functions. You should be careful when running code you have received from an untrusted source - because it can do almost anything.

# Creating

To create an editor project you simply create a folder named "editor" in your project folder. Any code in this folder will be treated as part of the editor project.

You will get a new project in your IDE called `.editor`.

![](https://cdn.sbox.game/doc/f484b909-752e-4fef-87f2-bc1df190be17)

# Why create an Editor Project

Creating an editor project lets you do a few special things.

- Create [Editor Widgets](/guides/editor/editor-widgets)

- Create [Editor Tools](/guides/editor/editor-tools)

- Create [Custom Inspectors for your Components or GameResources](/guides/editor/custom-editors)

- Create new Control Widgets

- Create new Editor Docks

- Create [Editor Apps](/guides/editor/editor-apps)

- Create [Editor Tools](/guides/editor/editor-tools)

- Create [Asset Previews](/guides/editor/asset-previews)