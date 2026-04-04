---
title: "Supported Types"
slug: "systems/networking-multiplayer/sync-properties"
order: 44
category: "systems"
source: "https://sbox.game/dev/doc/systems/networking-multiplayer/sync-properties/"
---

## Sync Attribute

Adding the `[Sync]` attribute to a property on a [Component](/guides/scene/components) will have its latest value sent to other players each time it changes.

```csharp
public class MyComponent : Component
{
  [Sync] public int Kills { get; set; }
}
```

These properties are controlled by the owner of the object, therefore only the owner of the object can change them.

# Supported Types

`[Sync]` properties support unmanaged types, and string. You can't synchronize every class with them, but any value type including structs will be fine. `int`, `bool`, `Vector3`, `float` are all examples of valid types.  We also support serializing specific classes such as `GameObject`, `Component`, `GameResource`.

# Detecting Changes

You can detect changes to a `[Sync]` property by also applying a the `[Change]` attribute to it. With this attribute you can specify the name of a callback method that will be invoked when the value of the property has changed.

Right now the `[Change]` attribute will not invoke the callback when a collection has changed. The callback will only be invoked when the property itself is assigned to something different.

```csharp
public class MyComponent : Component 
{
  [Sync, Change( "OnIsRunningChanged" )] public bool IsRunning { get; set; }
  
  private void OnIsRunningChanged( bool oldValue, bool newValue )
  {
    // The value of IsRunning has changed...
  }
}
```

# Sync Flags

You can customize the behaviour of a synchronized property with `SyncFlags`.

| Flag | Description |
| --- | --- |
| `SyncFlags.Query` | Enables Query Mode for the property. See the Query Mode section below. |
| `SyncFlags.FromHost` | The host has ownership over the value, instead of the owner of the networked object. Only the host may change the value. |
| `SyncFlags.Interpolate` | The value of the property will be interpolated for other clients. The value is interpolated over a few ticks. |

# Collections

Sometimes you want to network collections such as an entire list or a dictionary. We provide special classes to do that.

```csharp
public enum AmmoCount
{
  Pistol,
  Rifle
}

public class MyComponent : Component 
{
  [Sync] public NetList List { get; set; } = new();
  [Sync] public NetDictionary Dictionary { get; set; } = new();
}
```

You can initialize each in the declaration with `new()` or you can initialize the lists elsewhere, so long as you're doing so on the Owner of the network object. It doesn't matter if they are `null` for anyone else because they'll get created when they are networked if they need to be.

You can use `NetList` and `NetDictionary` like their regular counterparts. They contain indexers, `Add`, `Remove` and other methods you'd expect.

`NetList` and `NetDictionary` do not currently support the `[Property]` attribute.

# Query Mode

By default the properties are automatically marked dirty when set, via codegen magic.. meaning that when you set a property, if it's different we'll send the updated value to everyone.

```csharp
[Sync]
public Vector3 Velocity
{
	get;
	set;
}
```

No Query Mode needed. The only way to change Velocity is via the setter, which when called will mark it as changed using invisible codegen magic on the setter.

```csharp
Vector3 _velocity;
[Sync]
public Vector3 Velocity
{
	get => _velocity;
	set => _velocity = value;
}
```

Again - no Query Mode needed. The only way we're setting _velocity is via the setter - so it can never get out of date.

```csharp
Vector3 _velocity;
[Sync( SyncFlags.Query )]
public Vector3 Velocity
{
	get => _velocity;
	set => _velocity = value;
}

void SetVelocity( Vector3 val)
{
    _velocity = val;
}
```

Query Mode needed - because when you call `SetVelocity` it changes `_velocity` and the network system doesn't know that the `Velocity` value has changed. This could be avoided in that case by setting `Velocity` instead of `_velocity`.

With `SyncFlags.Query`, the variable is instead checked for changes every network update, and sent if changed. This is marginally slower than non-query mode, but it means that you can sync special stuff like this.