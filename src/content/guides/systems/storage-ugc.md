---
title: "Steam Workshop"
slug: "systems/storage-ugc"
category: "systems"
source: "https://sbox.game/dev/doc/systems/storage-ugc/"
---

The **Storage** system provides a simple, unified way to manage user-generated content in your game. Whether you're saving game progress, storing player creations, or anything else, Storage handles everything from local file management to Steam Workshop integration.

Each storage entry is a self-contained folder with its own filesystem, metadata, and optional thumbnail, making it easy to organize, share, and distribute user content.

Storage entries are categorized by a string type (like "save" or "dupe"), automatically maintain metadata, and can be seamlessly published to or downloaded from the Steam Workshop. The API is designed to be straightforward: create entries, read/write files, and optionally share them with the community.

## Creating a New Entry

To create a new storage entry, use `Storage.CreateEntry()` with a type identifier. The entry provides a `Files` property (a `BaseFileSystem`) that you use to read and write files.

// Create a new save game entry
var saveEntry = Storage.CreateEntry( "save" );

// Write game data to files
saveEntry.Files.WriteAllText( "player.json", playerJson );
saveEntry.Files.WriteAllBytes( "world.dat", worldData );

// You can also use JSON serialization
saveEntry.Files.WriteJson( "config.json", gameConfig );

// Set metadata for searching and display
saveEntry.SetMeta( "playerName", "John Doe" );
saveEntry.SetMeta( "level", 42 );
saveEntry.SetMeta( "playtime", 3600 );

// Create and set a thumbnail
var thumbnail = CreateThumbnailBitmap(); // Your method to create a Bitmap
saveEntry.SetThumbnail( thumbnail );

### Entry Properties

Each entry has the following public properties:

- `**Id**` - A unique identifier (GUID) for this entry

- `**Type**` - The category type (e.g., "save", "dupe")

- `**Created**` - When this entry was created

- `**Files**` - A `BaseFileSystem` for reading and writing files

- `**Thumbnail**` - The thumbnail image as a `Texture`

### Working with Files

The `Files` property is a full-featured filesystem that supports:

// Write operations
entry.Files.WriteAllText( "notes.txt", "Player notes..." );
entry.Files.WriteAllBytes( "screenshot.png", imageBytes );
entry.Files.WriteJson( "data.json", myObject );

// Read operations
string notes = entry.Files.ReadAllText( "notes.txt" );
byte[] screenshot = entry.Files.ReadAllBytes( "screenshot.png" ).ToArray();
MyData data = entry.Files.ReadJson<MyData>( "data.json" );

// File queries
bool exists = entry.Files.FileExists( "notes.txt" );
var allFiles = entry.Files.FindFile( "/", "*", recursive: true );

// Directories
entry.Files.CreateDirectory( "levels" );
entry.Files.WriteAllText( "levels/level1.json", levelData );

## Listing Entries

To retrieve all storage entries of a specific type from disk:

// Get all saved games
var allSaves = Storage.GetAll( "save" );

foreach ( var save in allSaves )
{
    // Access entry properties
    Log.Info( $"Save: {save.Id}" );
    Log.Info( $"Created: {save.Created}" );
    
    // Read metadata
    var playerName = save.GetMeta<string>( "playerName" );
    var level = save.GetMeta<int>( "level" );
    
    // Access the thumbnail
    var thumbnail = save.Thumbnail;
    
    // Read files from the entry
    if ( save.Files.FileExists( "player.json" ) )
    {
        var playerJson = save.Files.ReadAllText( "player.json" );
        // Load your game...
    }
}

### Deleting Entries

To remove an entry from disk:

entry.Delete();

This permanently removes the entry's folder and all its contents.

# Steam Workshop

Publishing to Steam Workshop is made very simple:

saveEntry.Publish();

This pops open a dialog for the client, where they can name, add a description and change visibility of the entry.

## Querying the Steam Workshop

To search for content on the Steam Workshop, create and configure a `Query`, then run it:

var query = new Storage.Query
{
	// Search for items with specific tags
	TagsRequired = { "save", "adventure" },

	// Exclude certain tags
	TagsExcluded = { "adult" },

	// Key-value filters (set during publish)
	KeyValues = { ["type"] = "save", ["package"] = "facepunch.sandbox" },

	// Text search
	SearchText = "epic quest",

	// Sort order
	SortOrder = Storage.SortOrder.RankedByVote,
};

// Run the query
var result = await query.Run();

Log.Info( $"Found {result.TotalCount} total items" );
Log.Info( $"Returned {result.ResultCount} items" );

foreach ( var item in result.Items )
{
	Log.Info( $"{item.Title} by {item.Owner.Name}" );
	Log.Info( $"Rating: {item.VotesUp}/{item.VotesDown}" );
	Log.Info( $"Created: {item.Created}" );
	Log.Info( $"Tags: {string.Join( ", ", item.Tags )}" );
}

### Available Sort Orders

The `SortOrder` enum provides various ranking options:

- `RankedByVote` - Most popular items

- `RankedByPublicationDate` - Newest first

- `RankedByTrend` - Currently trending

- `RankedByTotalPlaytime` - Most played

- `RankedByTextSearch` - Best search matches

- And many more...

### KeyValues

Any storage published automatically have two keyvalues

- `package` - the name of the package that published it

- `type` - the name of the storage type

These are  obviously useful when you only want to find packages from a specific game

## Installing from Workshop

To download and use content from the Steam Workshop, just call `Install` on the `Storage.QueryItem`

// From a query result
var query = new Storage.Query { TagsRequired = { "save" } };
Storage.QueryResult result = await query.Run();
Storage.QueryItem chosenItem = result.Items.First();

// Install the workshop item
Storage.Entry entry = await chosenItem.Install();
if ( entry == null ) throw new Exception( "Failed to install the chosen item." );
		
// The entry is now available locally
Log.Info( $"Installed: {entry.Type} - {entry.Id}" );

// Read its metadata
var playerName = entry.GetMeta<string>( "playerName" );

// Access its files (read-only)
if ( entry.Files.FileExists( "player.json" ) )
{
	var data = entry.Files.ReadAllText( "player.json" );
	// Load the save...
}

// Workshop entries are read-only
if ( entry.Files.IsReadOnly )
{
	Log.Info( "This is a workshop item (read-only)" );
}

### Important Notes

- Workshop entries are read-only.