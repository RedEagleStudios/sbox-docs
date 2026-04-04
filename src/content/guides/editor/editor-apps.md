---
title: "Creating"
slug: "editor/editor-apps"
order: 86
category: "editor"
source: "https://sbox.game/dev/doc/editor/editor-apps/"
---

Editor Apps are apps that run in the editor. They generally have their own window. They're sometimes used to edit specific types of asset.

Examples of editor apps are the ShaderGraph, Material Editor, Model Editor.

# Creating

To create an Editor App, you just need to add an `[EditorApp]` attribute to its main window.

```csharp
[EditorApp( "Example App", "pregnant_woman", "Inspect Butts" )]
public class MyEditorApp : Window
{
	public MyEditorApp()
	{
		WindowTitle = "Hello";
		MinimumSize = new Vector2( 300, 500 );
	}
}
```

The app will be available on the App sidebar and the Apps menu.

![](https://cdn.sbox.game/doc/24228dd7-08e9-4115-8022-df7d4fa5b0ce)