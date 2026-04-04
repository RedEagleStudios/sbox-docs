---
title: "File Systems"
slug: "systems/file-system"
category: "systems"
source: "https://sbox.game/dev/doc/systems/file-system/"
---

Standard .NET file access is restricted to prevent rogue access to your files, this means you can not use `System.IO.File` or variants directly.

Instead, s&box provides a [BaseFileSystem](https://asset.party/api/Sandbox.BaseFileSystem) for several virtual filesystems that can only access files within specific game directories.

# File Systems

There are a few different File Systems available to use in your game. Each one writes and reads from a different location.

## Data File System

[FileSystem.Data](https://asset.party/api/Sandbox.FileSystem.Data) is used to read and write data to a sub-directory specifically for the game that is currently running, i.e. `C:\steam\steamapps\common\sbox\data\org\game\`

## Mounted File System

[FileSystem.Mounted](https://asset.party/api/Sandbox.FileSystem.Mounted) is an aggregate filesystem of all mounted content from the core game, the current game and its dependencies.

## Organization File System

[FileSystem.OrganizationData](https://asset.party/api/Sandbox.FileSystem.OrganizationData) is a place to store user data across several games in your organization, i.e.

`C:\steam\steamapps\common\sbox\data\org\`

# Reading and Writing Text

// If the file doesn't exist already then write some data to it
if ( !FileSystem.Data.FileExists( "player.txt" ) )
    FileSystem.Data.WriteAllText( "player.txt", "Hello, world!" );

// Read the text back into a variable from the file
var hello = FileSystem.Data.ReadAllText( "player.txt" );

# Reading and Writing Json

`WriteJson` and `ReadJson` will only work with [Properties](https://learn.microsoft.com/en-us/dotnet/csharp/programming-guide/classes-and-structs/properties) of your class unless directed not to - make sure the things you want to save are [Properties](https://learn.microsoft.com/en-us/dotnet/csharp/programming-guide/classes-and-structs/properties)!

public class PlayerData
{
  	public int Level { get; set; } // Will be serialized
	public int MaxHealth { get; set; } // Will be serialized
	public string Username; // Won't be serialized

	public static void Save( PlayerData data )
	{
		FileSystem.Data.WriteJson( "player.json", data );
	}

	public static PlayerData Load()
	{
		return FileSystem.Data.ReadJson<PlayerData>( "player.json" );
	}
}