---
title: "Example"
slug: "systems/networking-multiplayer/network-events"
category: "systems"
source: "https://sbox.game/dev/doc/systems/networking-multiplayer/network-events/"
---

Your games will likely want to react to people joining and leaving the game. To help with this you can implement `Component.INetworkListener` or `Component.INetworkSpawn` on a component and place it in the scene.

# Example

Here's an example, where on joining the game a player object is created and the incoming player is assigned as the owner.

public sealed class GameNetworkManager : Component, Component.INetworkListener
{
	[Property] public GameObject PlayerPrefab { get; set; }
	[Property] public GameObject SpawnPoint { get; set; }

	/// <summary>
	/// Called on the host when someone successfully joins the server (including the local player)
	/// </summary>
	public void OnActive( Connection connection )
	{
		// Spawn a player for this client
		var player = PlayerPrefab.Clone( SpawnPoint.Transform.World );

		// Find the NameTag component and set their name correctly
		var nameTag = player.Components.Get<NameTagPanel>( FindMode.EverythingInSelfAndDescendants );
		if ( nameTag is not null )
		{
			nameTag.Name = connection.DisplayName;
		}

		// Spawn it on the network, assign connection as the owner
		player.NetworkSpawn( connection );
	}
}

# INetworkListener

The interface `INetworkListener` has multiple methods that you can optionally override.

Method
Description

`OnConnected`
The client has connected to the server. They're about to start handshaking, in which they'll load the game and download all the required packages.

`OnDisconnected`
The client has disconnected from the server.

`OnActive`
The client is fully connected and completely the handshake. After this call they will close the loading screen and start playing.

# INetworkSpawn

The interface `INetworkSpawn` has a method to react to objects spawning on the network.

**Method**
**Description**

`OnNetworkSpawn`
Called when this object is spawned on the network.