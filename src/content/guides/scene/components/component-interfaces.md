---
title: "ExecuteInEditor"
slug: "scene/components/component-interfaces"
order: 76
category: "scene"
source: "https://sbox.game/dev/doc/scene/components/component-interfaces/"
---

There are various interfaces that can be given to components for specific purposes.

# ExecuteInEditor

A component marked with `ExecuteInEditor` will also execute these methods in edit mode:

- [OnAwake](/guides/scene/components/component-methods/#h-onawake)

- [OnEnabled](/guides/scene/components/component-methods/#h-onenabled)

- [OnDisabled](/guides/scene/components/component-methods/#h-ondisabled)

- [OnUpdate](/guides/scene/components/component-methods/#h-onupdate)

- [OnFixedUpdate](/guides/scene/components/component-methods/#h-onfixedupdate)

### Sample code

```csharp
public sealed class ExecuteInEditorSample : Component, Component.ExecuteInEditor
{
	protected override void OnEnabled()
	{
		base.OnEnabled();

		if ( Game.IsEditor )
		{
			Log.Error( "OnEnabled is also executed in editor" );
		}
	}
}
```

# ICollisionListener

A component with this interface can react to physics collisions.

| Method | Description |
| --- | --- |
| `OnCollisionStart` | Called when this collider/rigidbody starts touching another collider. |
| `OnCollisionUpdate` | Called once per physics step for every collider being touched. |
| `OnCollisionStop` | Called when this collider/rigidbody stops touching another collider. |

### Sample code

```csharp
public sealed class CollisionListenerSample : Component, Component.ICollisionListener
{
	public void OnCollisionStart( Collision other )
	{
		Log.Error( "Collision started with: " + other.Other.GameObject );
	}

	public void OnCollisionUpdate( Collision other )
	{
		Log.Error( "Collision continued with: " + other.Other.GameObject );
	}

	public void OnCollisionStop( CollisionStop other )
	{
		Log.Error( "Collision stopped with: " + other.Other.GameObject );
	}
}
```

# ITriggerListener

A component with this interface can react to trigger interactions.

| Method | Description |
| --- | --- |
| `OnTriggerEnter` | Called when a collider enters the trigger. |
| `OnTriggerExit` | Called when a collider stops touching the trigger. |

### Sample code

```csharp
public sealed class TriggerListenerSample : Component, Component.ITriggerListener
{
	public void OnTriggerEnter( Collider other )
	{
		Log.Error( "Trigger entered with: " + other.GameObject );
	}

	public void OnTriggerExit( Collider other )
	{
		Log.Error( "Trigger exited with: " + other.GameObject );
	}
}
```

# IDamageable

A helper interface to mark components that can be damaged by something.

| Method | Description |
| --- | --- |
| `OnDamage` | The method you invoke when damaging something marked with IDamageable |

### Sample code

```csharp
public sealed class SampleDamageable : Component, Component.IDamageable
{
	public void OnDamage( in DamageInfo damage )
	{
		Log.Error( $"I got damaged for {damage.Damage} by {damage.Attacker}" );
	}
}
```

```csharp
public sealed class ClickToDamage : Component
{
	protected override void OnUpdate()
	{
		base.OnUpdate();

		if ( Input.Pressed( "attack1" ) )
		{
			var ray = Components.Get().ScreenPixelToRay( Mouse.Position );
			var trace = Scene.Trace.Ray( ray, 5000f ).Run();
			if ( trace.Hit )
			{
				var damageable = trace.GameObject.Components.Get();

				if ( damageable != null )
				{
					damageable.OnDamage( new DamageInfo()
					{
						Damage = 12,
						Attacker = GameObject,
						Position = trace.HitPosition,
					} );
				}
			}
		}
	}
}
```

# INetworkListener

A component with this interface can react to [📆 Network Events](/guides/systems/networking-multiplayer/network-events/#h-inetworklistener).

# INetworkSpawn

A component with this interface can react to [📆 Network Events](/guides/systems/networking-multiplayer/network-events/#h-inetworkspawn)