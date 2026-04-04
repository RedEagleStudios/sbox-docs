---
title: "Event Interface"
slug: "scene/components/events"
category: "scene"
source: "https://sbox.game/dev/doc/scene/components/events/"
---

You can broadcast and listen to events in your scene using interfaces.

These events aren't sent over the network. They are sent to **active** Components and GameObjectSystems in your scene.

# Event Interface

An event class is just a regular interface. You don't need to do anything else.

public interface IPlayerEvent
{
	void OnSpawned( Player player );
}

// Run an event telling everyone that playerThatSpawned has spawned
Scene.RunEvent<IPlayerEvent>( x => x.OnSpawned( playerThatSpawned ) );

You can, however, derive from `ISceneEvent`. This gives you a bit nicer syntax. Internally this is just calling Scene.Run on the active scene.

public interface IPlayerEvent : ISceneEvent<IPlayerEvent>
{
	void OnSpawned( Player player );
}

IPlayerEvent.Post( x => x.OnSpawned( playerThatSpawned ) );

You can also post events to specific GameObjects with `PostToGameObject`, instead of every object in the scene.

IPlayerEvent.PostToGameObject( player.GameObject, x => x.OnSpawned( player ) );

If your event interface has many events and you don't want to have to implement them all, you can define defaults.

public interface IPlayerEvent : ISceneEvent<IPlayerEvent>
{
	void OnSpawned( Player player ) { }

	void OnJump( Player player ) { }
	void OnLand( Player player, float distance, Vector3 velocity ) { }
	void OnTakeDamage( Player player, float damage ) { }
	void OnDied( Player player ) { }
	void OnWeaponAdded( Player player, BaseWeapon weapon ) { }
	void OnWeaponDropped( Player player, BaseWeapon weapon ) { }

	void OnCameraMove( Player player, ref Angles angles ) { }
	void OnCameraSetup( Player player, CameraComponent camera ) { }
	void OnCameraPostSetup( Player player, CameraComponent camera ) { }
}

# Broadcasting

Scene.RunEvent is the entry point to broadcast an event. This isn't limited to interfaces.. here's some interesting stuff you can do.

// tint all skinnedmodelrenderer's to red
Scene.RunEvent<SkinnedModelRenderer>( x => x.Tint = Color.Red );

// allow all listeners to change a value
float damage = 100.0f;
Scene.RunEvent<IPlayerDamageMesser>( x => x.ModifyDamage( player, damageinfo, ref damage ) );

// collect values
List<Vector3> damagePoints = new ();
Scene.RunEvent<IDamageProvider>( x => x.GetDamagePoint( damagePoints ) );

# Listening

To listen, you just implement the interface you want to use. This could be an interface you have created, or could be one of the built in event classes.

// A component with the ISceneLoadingEvents interface, 
// for listening to scene load events.
public class MyComponent : Component, ISceneLoadingEvents
{
	void ISceneLoadingEvents.AfterLoad( Scene scene )
	{
		// Called after scene has loaded
	}
}

//
// A camera component weapon, which listens to IPlayerEvent.
//
public class CameraWeapon : BaseWeapon, IPlayerEvent
{
	void IPlayerEvent.OnCameraMove( Player player, ref Angles angles )
	{
        // If the right mouse button down, stop them moving the view by moving the mouse
        // because we're going to be zooming in and out using right mouse.
        if ( Input.Down( "attack2" ) )
		{
			angles = default;
		}
	}
}

These events aren't available on Panels yet.