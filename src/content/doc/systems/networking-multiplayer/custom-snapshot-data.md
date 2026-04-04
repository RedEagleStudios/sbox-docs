---
title: "Writing Snapshot Data"
slug: "systems/networking-multiplayer/custom-snapshot-data"
order: 52
category: "systems"
source: "https://sbox.game/dev/doc/systems/networking-multiplayer/custom-snapshot-data/"
---

In some circumstances you may want to add additional data to the network snapshot that gets sent to clients when they join a server. One example of this might be serializing and deserializing voxel world data.

[Components](/doc/scene/components) in the [Scene](/doc/scene/scenes) can write and read their own data during the snapshot sending and receiving process by implementing `Component.INetworkSnapshot`.

# Writing Snapshot Data

To write snapshot data for a Component you can simply override the `WriteSnapshot` method on a component.

```csharp
private byte[] MyVoxelData { get; set; }
    
	void INetworkSnapshot.WriteSnapshot( ref ByteStream writer )
	{
        writer.Write( MyVoxelData.Length );
		writer.WriteArray( MyVoxelData );
	}
```

# Reading Snapshot Data

Reading snapshot data can be done by overriding `ReadSnapshot` on a component. You can return a Task here to have the loading screen wait for this to be done before continuing.

```csharp
void INetworkSnapshot.ReadSnapshot( ref ByteStream reader )
	{
        var length = reader.Read();
        MyVoxelData = reader.ReadArray( length ).ToArray();
	}
 
    protected override Task OnLoad()
    {
        await LoadVoxelWorld( MyVoxelData );
    }

	private Task LoadVoxelWorld( byte[] data )
	{
		// ...
	}
```