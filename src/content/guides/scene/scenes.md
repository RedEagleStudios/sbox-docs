---
title: "Getting the Current Scene"
slug: "scene/scenes"
category: "scene"
source: "https://sbox.game/dev/doc/scene/scenes/"
---

A [scene]() is a collection of [GameObjects].

# Getting the Current Scene

To get the current scene you can use the `Scene` accessor on any GameObject, Component, or Panel. You can also access it via the static `Game.ActiveScene`.

# Loading a New Scene

To load a new Scene, you can do any of the following:

// Replaces the current scene with the specified scene
Scene.Load( myNewScene );
Scene.LoadFromFile( "scenes/minimal.scene" );

// Additively loads the specified scene on top of the current scene
var load = new SceneLoadOptions();
load.SetScene( myNewScene );
load.IsAdditive = true;
Scene.Load( load );

# Directory

All scenes have a GameObject Directory. This holds all the GameObjects in the scene indexed by guid, and enforces that every object's guid is unique.

This also allows fast object lookups if you know the guid of the object.

var obj = Scene.Directory.FindByGuid( guid );

# GetAll / Get

The scene also holds a fast lookup index of every component. This allows you to quickly get every component of a certain type without having to keep your own lists, or iterate the entire scene.

// Tint all models a random colour
foreach ( var model in Scene.GetAll<ModelRenderer>() )
{
	model.Tint = Color.Random;
}

// Grab your singleton
var game = Scene.Get<GameManager>();