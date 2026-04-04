---
title: "Implementation"
slug: "scene/gameobjectsystem"
category: "scene"
source: "https://sbox.game/dev/doc/scene/gameobjectsystem/"
---

A scene can contain systems that need to do work in specific places during the frame.

For example, one of these systems is the `SceneAnimationSystem,` which finds all `SkinnedModelRenderer` components and works out all of their animations in parallel. This is faster than doing it in Update() and avoids weird out of order problems. It gives us a single point in the frame where we know for sure that all of the bone positions are up to date.

# Implementation

To create your own system, you just define a new class that derives from `GameObjectSystem`.

public class MyGameSystem : GameObjectSystem
{
	public MyGameSystem( Scene scene ) : base( scene )
	{
		Listen( Stage.PhysicsStep, 10, DoSomething, "DoingSomething" );
	}

	void DoSomething()
	{
		Log.Info( "Did something!" );
  
        var allThings = Scene.GetAllComponents<MyThing>();
        
        // do something to all of the things
	}
}

When a scene is created, a copy of every defined `GameObjectSystem` is created and added to it, you don't need to do anything else.

# Access

You can access a GameObjectSystem in a number of ways. One way is using `Scene.Get()`

You can also inherit from `GameObjectSystem` which adds a `static T Current` property to your system.

public class MyGameSystem : GameObjectSystem<MyGameSystem>
{
  	public MyGameSystem( Scene scene ) : base( scene )
	{
	}
 
    public void MyMethod()
    {
        Log.Info( "Hello, World!" );
    }
}

Then you can use them like…

MyGameSystem.Current.MyMethod();

# Stages & Order

Stages are based around certain events. For example, the PhysicsStep stage is called when ticking the physics, during FixedUpdate.

The order defines where to call your method during that event. -1 would call it before, +1 would call it after. You will be defining the systems, so getting them in an order you can live with is your business.

# Configuration

GameObjectSystems have two methods of configuration. You can either globally configure them, or edit them per scene.

In Project Settings, hit Systems — and you can configure them there.

Any property marked with [Property] will be configurable in project settings and saved.