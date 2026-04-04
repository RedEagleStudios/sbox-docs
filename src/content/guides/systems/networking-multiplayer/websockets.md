---
title: "Connection and Messaging"
slug: "systems/networking-multiplayer/websockets"
category: "systems"
source: "https://sbox.game/dev/doc/systems/networking-multiplayer/websockets/"
---

s&box allows you to use [WebSockets](https://en.wikipedia.org/wiki/WebSocket) to interface with an external server. Common usages include custom networking, or persistent data outside of a local filesystem.

# Connection and Messaging

Adding this [Component](/guides/scene/components) to a [GameObject](/guides/scene/gameobject) in the [Scene](/guides/scene/scenes) will ensure the connection is started when the game starts.

public sealed class Server : Component
{
	// Example: wss://host.example:443/ws
	[Property] public string ConnectionUri { get; set; }
	public WebSocket Socket { get; set; }

	protected override void OnStart()
	{
		Socket = new WebSocket();
		Socket.OnMessageReceived += HandleMessageReceived;
		_ = Connect();
	}

	// Connect to the server and send a message
	private async Task Connect()
	{
		await Socket.Connect( ConnectionUri );
		await SendMessage( "Hello!" );
	}

	private async Task SendMessage( string message )
	{
		await Socket.Send( message );
	}

	// Log our received messages
	private void HandleMessageReceived( string message )
	{
		Log.Info( message );
	}
}

# Using Auth Tokens

You could attach an [Auth Token](/guides/systems/services/auth-tokens) to your WebSocket request header like so:

var token = await Sandbox.Services.Auth.GetToken( "YourServiceName" );

if ( string.IsNullOrEmpty( token ) )
{
	// Unable to fetch a valid session token
	return;
}

var headers = new Dictionary<string, string>()
{
	{ "Authorization", token }
};

await socket.Connect( "ws://localhost:8080", headers );