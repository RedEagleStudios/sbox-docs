---
title: "Startup"
slug: "about/getting-started/project-types/game-project"
category: "about"
source: "https://sbox.game/dev/doc/about/getting-started/project-types/game-project/"
---

A game project is the base level of project. It contains a game.

# Startup

The game project generally defines a startup scene in its project settings. This scene is usually loaded first - before any other scene.

Depending on the game you're making, you might want an intro or menu scene. You can set the startup scene to your menu scene, and have your menu load your main game scene after the user chooses to play.

It's totally valid to not have a menu or intro scene though, and just jump straight into the game.

# Maps

If your game is capable of loading maps from the main menu then that map is loaded instead of your startup scene. This presents a problem for your game - because none of your game stuff is in that map. You probably want to spawn UI and game manager stuff in the map, in order to let people play.

The way to do this is to create a [GameObjectSystem] that will spawn in all that stuff. Here's an example where we spawn it in from another scene.

public sealed class MyGameManager : GameObjectSystem<MyGameManager>, ISceneStartup
{
	public MyGameManager( Scene scene ) : base( scene )
	{
	}

	void ISceneStartup.OnHostInitialize()
	{
		var slo = new SceneLoadOptions();
		slo.IsAdditive = true;
		slo.SetScene( "scenes/engine.scene" );
		Scene.Load( slo );
	}
}