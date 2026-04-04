---
title: "HudPainter"
slug: "systems/ui/hudpainter"
order: 66
category: "systems"
source: "https://sbox.game/dev/doc/systems/ui/hudpainter/"
---

Each camera has a HudPainter that can be used to draw onto the HUD. You do this every frame, in any Update function.

This is more efficient than using actual UI panels because there's no layout, stylesheets or interactivity.. you're doing all that stuff yourself.

If your UI is relatively simple, you can do it this way to keep things easy.

```csharp
protected override void OnUpdate()
	{
		if ( Scene.Camera is null )
			return;

		var hud = Scene.Camera.Hud;

		hud.DrawRect( new Rect( 300, 300, 10, 10 ), Color.White );

		hud.DrawLine( new Vector2( 100, 100 ), new Vector2( 200, 200 ), 10, Color.White );

		hud.DrawText( new TextRendering.Scope( "Hello!", Color.Red, 32 ), Screen.Width * 0.5f );
	}
```