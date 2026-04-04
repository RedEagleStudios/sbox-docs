---
title: "Volume"
slug: "systems/post-processing/postprocessvolume"
category: "systems"
source: "https://sbox.game/dev/doc/systems/post-processing/postprocessvolume/"
---

![](https://cdn.sbox.game/doc/c9760f92-c997-441b-885e-69afab86ab09)

`PostProcessVolume` It is a component that applies a set of post-processing components when a camera is inside it.

The effect components can be on the same GameObject as the `PostProcessVolume` component, or on a child GameObject.

![](https://cdn.sbox.game/doc/ef8b46a1-5052-4e6a-9c88-4387332864a2)

# Volume

The volume can be a box, sphere or infinite.

The **infinite mode** is useful for adding effects that you only want to apply sometimes. For example, you might want to fade up `FilmGrain` when a player is dying of radiation poisoning. You can have this effect in a GameObject with an infinite PostProcessVolume somewhere, and enable and slide up the `BlendWeight` depending on how much of the effect you want to apply.

# Blending

Blending is done according to how far in the volume you are using the `BlendDistance` property.

# Editor Preview

When the volume is selected the editor will show a preview of that effect. If you don't want this to keep happening you can disable `Editor Preview` on the component.