---
title: "Post Processing"
slug: "systems/post-processing"
order: 55
category: "systems"
source: "https://sbox.game/dev/doc/systems/post-processing/"
---

Post-processing effects can be applied by adding components to the Camera or to a [PostProcessVolume](/guides/systems/post-processing/postprocessvolume).

# Camera Settings

The Camera component has settings especially for post processing.

### EnablePostProcessing

Disable to prevent post processing from rendering on this camera at all.

### PostProcessAnchor

By default when triggering `PostProcessVolume`'s we use the camera's position.

This isn't always the behaviour you want. For example, if you're making a top down game, you probably want it to use the player's position.

If this is set, we'll use the world position of that GameObject to find PostProcessVolume's instead of the Camera's position.