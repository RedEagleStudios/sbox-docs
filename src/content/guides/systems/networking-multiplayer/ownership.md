---
title: "Default Owners"
slug: "systems/networking-multiplayer/ownership"
order: 43
category: "systems"
source: "https://sbox.game/dev/doc/systems/networking-multiplayer/ownership/"
---

Networked GameObjects can be owned by a connection.

Objects that are owned by a connection are simulated by that connection. Their position and their variables are all controlled by the controlling client.

If an object is unowned by a connection then it is simulated by the host.

## Owner Transfer

By default, a networked object's owner can only be changed by the host. However, the current owner of the object can change that behavior by setting its `OwnerTransfer` value.

```csharp
// Make it so anyone can change the owner of this networked object.
go.Network.SetOwnerTransfer( OwnerTransfer.Takeover );
```

Type
Behaviour

`OwnerTransfer.Takeover`
Anyone can change the owner

`OwnerTransfer.Fixed` *(default)*
Only the host can change the owner

`OwnerTransfer.Request`
A request must be made to the host to change the owner

## Getting the Owner

You can find the owner of a GameObject by checking `Network.OwnerId`.

```csharp
public override void Update()
{
	Log.Info( $"Owner is {Network.OwnerId}" );
}
```

In reality, day to day, you won't really be interested in the particular owner. You only care about whether you're meant to be simulating it or not. You do that by checking `IsProxy` - which is true if the GameObject is being simulated by another client (or the server).

```csharp
public override void Update()
{
    // this is controlled by someone else
    if ( IsProxy ) return;
    
    // if we pressed E, try to pick something up
    if ( Input.Pressed( "use" ) )
    {
        TryPickup();
    }
}
```

## Taking Ownership

You can take ownership of an object, which makes you the simulator.

```csharp
void TryPickup()
{
	// are we looking at anything?
	var tr = Physics.Trace.WithoutTags( "player" )
			.Sphere( 16, EyePos, EyePos + LookDir.Forward * 100 )
			.Run();

	if ( !tr.Hit ) return;

	if ( tr.Body.GameObject is not GameObject go )
		return;

	if ( !go.Tags.Has( "pickup" ) )
		return;

    // You're my wife now
	go.Network.TakeOwnership();
 
    // Store that we're carrying it 
	Carrying = go;
}
```

So for example, if a player picks up an object, the player could take ownership of that object. That way the position is controlled by that player.

If a player gets in a car, you could make the player the owner of that car - then its position will be controlled by that player.

And of course, the player is generally controlled by its own connection.

## Dropping Ownership

You can also stop owning an object. At that point the object becomes owned by the server.

```csharp
void ThrowObject()
{
	if ( !Carrying.IsValid() )
		return;

	// Stop owning this
	Carrying.Network.DropOwnership();
	Carrying = null;
}
```

# Default Owners

If you make an object in the scene editor networked, by default it will not have an owner. It will be simulated by the host.

When a client creates a network object via `GameObject.NetworkSpawn()`, they will be the owner of that object.

# Disconnection

By default all networked objects that a client owns will be destroyed for everyone when they disconnect. You can change this by setting the **Orphaned Mode** for that networked object. Only the current owner can change the **Orphaned Mode**.

Simply call `GameObject.Network.SetOrphanedMode` with one of the following options:

Type
Behaviour

`NetworkOrphaned.Destroy` *(default)*
The object will be destroyed when the owner disconnects

`NetworkOrphaned.Host`
The host will be assigned ownership when the current owner disconnects

`NetworkOrphaned.Random`
A random client will be assigned ownership when the current owner disconnects

`NetworkOrphaned.ClearOwner`
The object will remain but ownership will be cleared (the host will simulate the object)