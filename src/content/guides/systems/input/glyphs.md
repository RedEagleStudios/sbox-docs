---
title: "glyphs"
slug: "systems/input/glyphs"
category: "systems"
source: "https://sbox.game/dev/doc/systems/input/glyphs/"
---

Input glyphs are an easy way to show users which buttons to press for actions, they automatically adjust for whatever device you're using and return appropriate textures.

Texture JumpButton = Input.GetGlyph( "jump" );

Glyphs can change from users rebinding keys, or switching input devices - so it's worth it just grabbing them every frame.

You can also choose between the default and outlined versions of glyphs, like so:

Texture JumpButton = Input.GetGlyph( "jump", true );

![PlayStation glyphs using the outline style](https://cdn.sbox.game/doc/c122f5bf-f2c4-4f97-a844-24e80dd03ef0)

To use these quickly and easily in razor, you can use the resulting texture directly in an <Image> panel:

<Image Texture="@Input.GetGlyph( "jump", InputGlyphSize.Medium, true )" />

**Examples**

![Hints using keyboard and mouse](https://cdn.sbox.game/doc/ea10e59f-7514-4d10-9825-cf9b6d415ef6)

![Hints using an Xbox controller](https://cdn.sbox.game/doc/435d3a0b-30ec-4a28-ac53-2c981147383e)